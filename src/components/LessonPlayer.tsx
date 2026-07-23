import { useEffect, useRef, useState } from 'react';
import { Lesson } from '../types';
import { audioService } from '../services/audioService';
import { pitchDetectionService } from '../services/pitchDetectionService';
import SongVersionToggle from './SongVersionToggle';

export interface LessonResult {
  durationSeconds: number;
  notesPlayed: number;
  correctNotes: number;
  hardestNotes: string[];
}

interface LessonPlayerProps {
  lesson: Lesson;
  onExit: () => void;
  onComplete: (result: LessonResult) => void;
}

export default function LessonPlayer({ lesson, onExit, onComplete }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [useFullVersion, setUseFullVersion] = useState(false);
  const [isGuidedPractice, setIsGuidedPractice] = useState(false);
  const [feedback, setFeedback] = useState('Choose Listen first, then start guided practice.');
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [correctNotes, setCorrectNotes] = useState(0);
  const [practiceTempo, setPracticeTempo] = useState(lesson.tempo);
  const startedAtRef = useRef(Date.now());
  const playingRef = useRef(false);

  const handleVersionChange = (useFull: boolean) => {
    setUseFullVersion(useFull);
    setCurrentNoteIndex(0); // Reset to beginning when switching versions
  };

  const getCurrentNotes = () => {
    return useFullVersion && lesson.fullVersionNotes ? lesson.fullVersionNotes : lesson.notes;
  };

  const currentNotes = getCurrentNotes();

  const normalizeNote = (note: string) => note.trim().toUpperCase().replace('♭', 'B');

  useEffect(() => () => {
    playingRef.current = false;
    pitchDetectionService.stop();
    audioService.stopAllNotes();
  }, []);

  const handlePlay = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playingRef.current = true;
      try {
        // Initialize audio service
        await audioService.initialize();
        
        // Play the lesson notes
        for (let i = currentNoteIndex; i < currentNotes.length && playingRef.current; i++) {
          setCurrentNoteIndex(i);
          const note = currentNotes[i];
          audioService.playNote(note.note, note.duration);
          // Wait for note duration (convert beats to seconds)
          await new Promise(resolve => setTimeout(resolve, (note.duration * 60 / practiceTempo) * 1000));
        }
        if (playingRef.current) setCurrentNoteIndex(0);
      } catch (error) {
        console.error('Error playing notes:', error);
      } finally {
        playingRef.current = false;
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    playingRef.current = false;
    setIsPlaying(false);
    audioService.stopAllNotes();
  };

  const stopGuidedPractice = () => {
    pitchDetectionService.stop();
    setIsGuidedPractice(false);
    setFeedback('Practice paused. Your progress is saved on this screen.');
  };

  const startGuidedPractice = async () => {
    if (isGuidedPractice) {
      stopGuidedPractice();
      return;
    }

    startedAtRef.current = Date.now();
    setCurrentNoteIndex(0);
    setAttempts({});
    setCorrectNotes(0);
    setPracticeTempo(lesson.tempo);
    setFeedback(`Play ${currentNotes[0]?.note ?? 'the first note'}.`);

    try {
      await pitchDetectionService.start((detectedNote) => {
        setCurrentNoteIndex((index) => {
          const expected = currentNotes[index];
          if (!expected) return index;

          if (normalizeNote(detectedNote) === normalizeNote(expected.note)) {
            setCorrectNotes((value) => value + 1);
            setFeedback(index + 1 >= currentNotes.length
              ? 'Excellent — guided practice complete.'
              : `Correct. Now play ${currentNotes[index + 1].note}.`);
            if (index + 1 >= currentNotes.length) {
              pitchDetectionService.stop();
              setIsGuidedPractice(false);
            }
            return Math.min(index + 1, currentNotes.length);
          }

          setAttempts((previous) => {
            const nextCount = (previous[index] ?? 0) + 1;
            if (nextCount >= 2) {
              setPracticeTempo((tempo) => Math.max(45, Math.round(tempo * 0.85)));
              setFeedback(`Let’s isolate this note. You played ${detectedNote}; aim for ${expected.note}. The practice tempo is now slower.`);
              void audioService.initialize().then(() => audioService.playNote(expected.note, '4n'));
            } else {
              setFeedback(`Close — you played ${detectedNote}. Try ${expected.note} again.`);
            }
            return { ...previous, [index]: nextCount };
          });
          return index;
        });
      });
      setIsGuidedPractice(true);
    } catch {
      setFeedback('Microphone access is required for guided practice. You can still use Listen mode.');
      setIsGuidedPractice(false);
    }
  };

  const finishLesson = () => {
    const hardestNotes = Object.entries(attempts)
      .filter(([, count]) => count >= 2)
      .map(([index]) => currentNotes[Number(index)]?.note)
      .filter((note): note is string => Boolean(note));
    onComplete({
      durationSeconds: Math.max(30, Math.round((Date.now() - startedAtRef.current) / 1000)),
      notesPlayed: correctNotes + Object.values(attempts).reduce((sum, value) => sum + value, 0),
      correctNotes,
      hardestNotes,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{lesson.title}</h2>
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Song Version Toggle */}
          <SongVersionToggle
            hasFullVersion={lesson.hasFullVersion || false}
            onVersionChange={handleVersionChange}
            disabled={isPlaying}
          />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {lesson.difficulty}
              </span>
              <span className="text-gray-500 text-sm">{lesson.tempo} BPM</span>
              {practiceTempo < lesson.tempo && (
                <span className="text-amber-700 text-sm font-semibold">Adaptive tempo: {practiceTempo} BPM</span>
              )}
              <span className="text-gray-500 text-sm">{lesson.category}</span>
            </div>
            <p className="text-gray-700">{lesson.synopsis || lesson.practiceTip || 'Learn this beautiful violin piece!'}</p>
          </div>

          {/* Tutorial Content */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🎵 Tutorial</h3>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>Step 1:</strong> Hold your violin with proper posture
              </p>
              <p className="text-gray-700">
                <strong>Step 2:</strong> Place your fingers on the correct positions
              </p>
              <p className="text-gray-700">
                <strong>Step 3:</strong> Use the bow with smooth, even pressure
              </p>
              <p className="text-gray-700">
                <strong>Step 4:</strong> Follow the notes shown below
              </p>
            </div>
          </div>

          {/* Notes Display */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notes to Play:</h3>
              <span className="text-sm text-gray-600">{currentNotes.length} notes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentNotes.map((note, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg font-mono text-lg ${
                    index === currentNoteIndex
                      ? 'bg-purple-600 text-white'
                      : index < currentNoteIndex
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {note.note}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-purple-950">Guided feedback</p>
                <p className="text-sm text-purple-800">{feedback}</p>
              </div>
              <div className="text-sm font-semibold text-purple-900">
                {Math.min(currentNoteIndex, currentNotes.length)} / {currentNotes.length} notes
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? 'Playing…' : 'Listen'}
            </button>
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Stop
            </button>
            <button
              onClick={() => void startGuidedPractice()}
              disabled={isPlaying}
              className="px-6 py-3 bg-purple-900 text-white rounded-xl font-bold hover:bg-purple-800 transition-colors disabled:opacity-50"
            >
              {isGuidedPractice ? 'Pause practice' : 'Start guided practice'}
            </button>
          </div>

          <button
            onClick={finishLesson}
            disabled={correctNotes < currentNotes.length}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            {correctNotes >= currentNotes.length ? 'Complete lesson' : 'Complete guided practice to finish'}
          </button>
        </div>
      </div>
    </div>
  );
}
