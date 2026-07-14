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
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0.5);

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
    } else {
      try {
        await pitchDetectionService.start((noteName: string, _frequency: number) => {
          setDetectedPitch(noteName);
        });
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start pitch detection:', error);
      }
    }
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
        {isListening && detectedPitch && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Detected Pitch</p>
              <p className="text-4xl font-bold text-purple-600">{detectedPitch}</p>
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
