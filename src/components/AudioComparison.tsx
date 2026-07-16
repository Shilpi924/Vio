import { useState } from 'react';
import { audioService } from '../services/audioService';

interface AudioComparisonProps {
  targetNote: string;
  targetDuration?: string | number;
}

export default function AudioComparison({ targetNote, targetDuration = '1n' }: AudioComparisonProps) {
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const playTargetNote = async () => {
    setIsPlayingTarget(true);
    await audioService.initialize();
    audioService.playNote(targetNote, targetDuration);
    setTimeout(() => setIsPlayingTarget(false), 1000);
  };

  const playUserRecording = () => {
    if (hasRecorded) {
      setIsPlayingUser(true);
      // Simulate playing back user recording
      setTimeout(() => setIsPlayingUser(false), 1000);
    }
  };

  const startRecording = () => {
    // Simulate recording
    setTimeout(() => {
      setHasRecorded(true);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎵 Compare Your Sound</h2>
      
      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">🎯 How to Use:</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• First, listen to what the note should sound like</li>
          <li>• Then, play the note on your violin</li>
          <li>• Compare and adjust until they sound the same</li>
        </ul>
      </div>

      {/* Target Note Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">What it should sound like:</h3>
          <span className="text-2xl font-bold text-purple-600">{targetNote}</span>
        </div>
        <button
          onClick={playTargetNote}
          disabled={isPlayingTarget}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
            isPlayingTarget
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105'
          }`}
        >
          {isPlayingTarget ? '🔊 Playing...' : '▶️ Listen to Target Note'}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 font-medium">VS</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* User Recording Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Your sound:</h3>
          {!hasRecorded && <span className="text-sm text-orange-600 font-medium">Not recorded yet</span>}
          {hasRecorded && <span className="text-sm text-green-600 font-medium">✓ Recorded</span>}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={startRecording}
            disabled={hasRecorded}
            className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all ${
              hasRecorded
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg hover:scale-105'
            }`}
          >
            {hasRecorded ? '🎤 Recorded' : '🎤 Record Your Sound'}
          </button>
          
          <button
            onClick={playUserRecording}
            disabled={!hasRecorded || isPlayingUser}
            className={`flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all ${
              !hasRecorded || isPlayingUser
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isPlayingUser ? '🔊 Playing...' : '▶️ Play Your Sound'}
          </button>
        </div>
      </div>

      {/* Comparison Feedback */}
      {hasRecorded && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-800 font-medium">
              Great job! Keep practicing to match the sound perfectly.
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
        <h3 className="font-bold text-orange-900 mb-2">💡 Tips for Better Sound:</h3>
        <ul className="text-orange-800 space-y-1 text-sm">
          <li>• Press the string firmly but don't squeeze</li>
          <li>• Keep your bow straight and steady</li>
          <li>• Use enough bow speed for a clear sound</li>
          <li>• Listen carefully to the pitch difference</li>
        </ul>
      </div>
    </div>
  );
}
