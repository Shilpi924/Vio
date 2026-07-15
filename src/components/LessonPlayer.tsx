import { useState } from 'react';
import { Lesson } from '../types';
import { audioService } from '../services/audioService';

interface LessonPlayerProps {
  lesson: Lesson;
  onExit: () => void;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onExit, onComplete }: LessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const handlePlay = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      try {
        // Initialize audio service
        await audioService.initialize();
        
        // Play the lesson notes
        for (let i = currentNoteIndex; i < lesson.notes.length; i++) {
          setCurrentNoteIndex(i);
          const note = lesson.notes[i];
          audioService.playNote(note.note, note.duration);
          // Wait for note duration (convert beats to seconds)
          await new Promise(resolve => setTimeout(resolve, (note.duration * 60 / lesson.tempo) * 1000));
        }
        setCurrentNoteIndex(0);
      } catch (error) {
        console.error('Error playing notes:', error);
      } finally {
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    audioService.stopAllNotes();
    setCurrentNoteIndex(0);
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
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {lesson.difficulty}
              </span>
              <span className="text-gray-500 text-sm">{lesson.tempo} BPM</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes to Play:</h3>
            <div className="flex flex-wrap gap-2">
              {lesson.notes.map((note, index) => (
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

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? '▶️ Playing...' : '▶️ Play'}
            </button>
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              ⏹️ Stop
            </button>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            ✓ Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
