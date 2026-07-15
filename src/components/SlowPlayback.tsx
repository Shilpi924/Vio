import { useState } from 'react';

export default function SlowPlayback() {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes sample

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🎵 Slow Playback Practice</h2>

      {/* Playback Controls */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl hover:shadow-lg transition-shadow"
          >
            ⏪
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-3xl text-white hover:shadow-xl transition-all hover:scale-105"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl hover:shadow-lg transition-shadow"
          >
            ⏩
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 cursor-pointer">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Speed Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-1">
            {playbackSpeed}x
          </div>
          <p className="text-sm text-gray-600">Playback Speed</p>
        </div>
      </div>

      {/* Speed Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Select Speed</h3>
        <div className="grid grid-cols-5 gap-3">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`py-4 rounded-xl font-bold text-lg transition-all ${
                playbackSpeed === speed
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Practice Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-2">💡 Practice Tips:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Start at 0.5x speed to learn the notes</li>
          <li>• Gradually increase speed as you improve</li>
          <li>• Focus on accuracy over speed</li>
          <li>• Use the metronome with slow playback</li>
        </ul>
      </div>

      {/* Difficulty Level */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-2">🎯 Recommended Speeds:</h3>
        <div className="space-y-2 text-sm text-orange-800">
          <div className="flex justify-between">
            <span>Beginner</span>
            <span className="font-medium">0.5x - 0.75x</span>
          </div>
          <div className="flex justify-between">
            <span>Intermediate</span>
            <span className="font-medium">0.75x - 1.0x</span>
          </div>
          <div className="flex justify-between">
            <span>Advanced</span>
            <span className="font-medium">1.0x - 1.5x</span>
          </div>
        </div>
      </div>

      {/* Loop Section */}
      <div className="mt-6 bg-white border-2 border-purple-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">🔄 Loop Section</h3>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            Set Start
          </button>
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            Set End
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Enable Loop
          </button>
        </div>
      </div>
    </div>
  );
}
