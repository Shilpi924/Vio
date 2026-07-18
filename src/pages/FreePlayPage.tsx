import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const violinStrings = [
  { name: 'G', note: 'G3', color: 'from-amber-400 to-amber-600' },
  { name: 'D', note: 'D4', color: 'from-blue-400 to-blue-600' },
  { name: 'A', note: 'A4', color: 'from-green-400 to-green-600' },
  { name: 'E', note: 'E5', color: 'from-purple-400 to-purple-600' },
];

export default function FreePlayPage() {
  const navigate = useNavigate();
  const [activeString, setActiveString] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);

  const playString = (stringName: string) => {
    setActiveString(stringName);
    // In a real app, this would use Web Audio API to play the note
    setTimeout(() => setActiveString(null), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">� Free Play</h1>
          <p className="text-lg text-gray-600">Tap the strings and make music!</p>
        </div>

        {/* Violin Strings */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {violinStrings.map((string) => (
              <div
                key={string.name}
                onClick={() => playString(string.name)}
                className={`cursor-pointer transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${string.color} rounded-2xl p-6 text-white shadow-md ${
                  activeString === string.name ? 'ring-4 ring-white scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">{string.name} String</div>
                  <div className="text-2xl">{string.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔊</span>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-lg font-bold text-gray-700">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">🎵 Tips</h2>
          <div className="space-y-3 text-gray-600">
            <p>• <strong>G String:</strong> The lowest string (G3)</p>
            <p>• <strong>D String:</strong> Second lowest (D4)</p>
            <p>• <strong>A String:</strong> Second highest (A4)</p>
            <p>• <strong>E String:</strong> The highest string (E5)</p>
            <p>• <strong>Tap any string</strong> to play it</p>
            <p>• <strong>Have fun!</strong> Experiment and make your own music</p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-300 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
