import { useState, useEffect } from 'react';
import ViolinFingerboard from '../components/ViolinFingerboard';
import ViolinStrings from '../components/ViolinStrings';
import { audioService } from '../services/audioService';
import { pitchDetectionService } from '../services/pitchDetectionService';
import type { ViolinString, FingerNumber } from '../types';

export default function FreePlayPage() {
  const [activeString, setActiveString] = useState<ViolinString | undefined>();
  const [highlightNote, setHighlightNote] = useState<{ string: ViolinString; finger: FingerNumber } | undefined>();
  const [detectedPitch, setDetectedPitch] = useState<string | null>(null);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [accuracyScore, setAccuracyScore] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [practiceMode, setPracticeMode] = useState<'free' | 'target'>('free');

  useEffect(() => {
    return () => {
      audioService.stopAllNotes();
      pitchDetectionService.stop();
    };
  }, []);

  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  const handleNoteClick = async (string: ViolinString, finger: FingerNumber, note: string) => {
    await audioService.initialize();
    setHighlightNote({ string, finger });
    setActiveString(string);
    
    audioService.playNote(note, '8n');
    
    setTimeout(() => {
      setHighlightNote(undefined);
    }, 500);
  };

  const handleStringClick = async (string: ViolinString) => {
    await audioService.initialize();
    setActiveString(string);
    const note = string === 'G' ? 'G3' : string === 'D' ? 'D4' : string === 'A' ? 'A4' : 'E5';
    audioService.playNote(note, '4n');
    
    setTimeout(() => {
      setActiveString(undefined);
    }, 1000);
  };

  const togglePitchDetection = async () => {
    if (isListening) {
      pitchDetectionService.stop();
      setIsListening(false);
      setDetectedPitch(null);
      setDetectedFrequency(null);
    } else {
      try {
        await pitchDetectionService.start((noteName: string, frequency: number) => {
          setDetectedPitch(noteName);
          setDetectedFrequency(frequency);
          
          // Track accuracy in practice mode
          if (practiceMode === 'target' && targetNote) {
            setTotalAttempts(prev => prev + 1);
            if (noteName === targetNote) {
              setAccuracyScore(prev => prev + 1);
            }
          }
        });
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start pitch detection:', error);
      }
    }
  };

  const setRandomTargetNote = () => {
    const notes = ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setTargetNote(randomNote);
    setAccuracyScore(0);
    setTotalAttempts(0);
  };

  const getAccuracyPercentage = () => {
    if (totalAttempts === 0) return 0;
    return Math.round((accuracyScore / totalAttempts) * 100);
  };

  const getTargetFrequency = (noteName: string): number => {
    const noteFrequencies: Record<string, number> = {
      'G3': 196.00,
      'A3': 220.00,
      'B3': 246.94,
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'F#4': 369.99,
      'G4': 392.00,
      'A4': 440.00,
      'B4': 493.88,
      'C#5': 523.25,
      'D5': 587.33,
    };
    return noteFrequencies[noteName] || 440.00;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Free Play</h1>
            <p className="text-lg text-gray-700">Practice freely with your violin or use the virtual fingerboard.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Practice Mode Toggle */}
            <button
              onClick={() => {
                setPracticeMode(practiceMode === 'free' ? 'target' : 'free');
                if (practiceMode === 'free') {
                  setRandomTargetNote();
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                practiceMode === 'target'
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {practiceMode === 'free' ? '🎯 Practice Mode' : '🎵 Free Mode'}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow">
              <span className="text-gray-600">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>

            {/* Pitch Detection Toggle */}
            <button
              onClick={togglePitchDetection}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isListening ? '🎙️ Stop Listening' : '🎙️ Start Listening'}
            </button>
          </div>
        </div>

        {/* Detected Pitch Display */}
        {isListening && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center">
              {practiceMode === 'target' && targetNote ? (
                <>
                  <p className="text-gray-600 mb-2">Target Note</p>
                  <p className="text-4xl font-bold text-purple-600 mb-4">{targetNote}</p>
                  <div className="h-px bg-gray-200 my-4"></div>
                  <p className="text-gray-600 mb-2">Detected Pitch</p>
                  <p className={`text-4xl font-bold ${detectedPitch === targetNote ? 'text-green-600' : 'text-blue-600'}`}>
                    {detectedPitch || '...'}
                  </p>
                  {detectedFrequency && (
                    <p className="text-sm text-gray-500 mt-2">{detectedFrequency.toFixed(1)} Hz (±{Math.abs(detectedFrequency - getTargetFrequency(targetNote)).toFixed(1)} Hz)</p>
                  )}
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-lg font-semibold text-purple-900">
                      Accuracy: {getAccuracyPercentage()}% ({accuracyScore}/{totalAttempts})
                    </p>
                  </div>
                  <button
                    onClick={setRandomTargetNote}
                    className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                  >
                    New Target Note
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Detected Pitch</p>
                  <p className="text-4xl font-bold text-purple-600">{detectedPitch || '...'}</p>
                  {detectedFrequency && (
                    <p className="text-sm text-gray-500 mt-2">{detectedFrequency.toFixed(1)} Hz</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use Free Play</h2>
          <ul className="text-gray-700 space-y-2">
            <li>• <strong>Virtual Fingerboard:</strong> Click on finger positions to hear notes and see finger placement</li>
            <li>• <strong>Violin Strings:</strong> Click on strings to hear open string notes</li>
            <li>• <strong>Pitch Detection:</strong> Click "Start Listening" to detect notes from your real violin</li>
            <li>• <strong>Practice Mode:</strong> Toggle practice mode to play target notes and track your accuracy</li>
            <li>• <strong>Volume:</strong> Adjust the volume slider to control audio output</li>
          </ul>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Violin Fingerboard */}
          <ViolinFingerboard
            showLabels={true}
            showNoteNames={true}
            highlightNote={highlightNote}
            onNoteClick={handleNoteClick}
          />

          {/* Violin Strings */}
          <ViolinStrings
            activeString={activeString}
            onStringClick={handleStringClick}
            showLabels={true}
          />
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">G String (G3)</h3>
              <p className="text-sm text-amber-800">Lowest string. Notes: G, A, B, C, D</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">D String (D4)</h3>
              <p className="text-sm text-amber-800">Notes: D, E, F#, G, A</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">A String (A4)</h3>
              <p className="text-sm text-amber-800">Notes: A, B, C#, D, E</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-2">E String (E5)</h3>
              <p className="text-sm text-amber-800">Highest string. Notes: E, F#, G#, A, B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
