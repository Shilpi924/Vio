import { useState, useEffect } from 'react';

export default function PracticeTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [goalMinutes, setGoalMinutes] = useState(15);
  const [completedGoals, setCompletedGoals] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const completeGoal = () => {
    if (seconds >= goalMinutes * 60) {
      setCompletedGoals((prev) => prev + 1);
      resetTimer();
    }
  };

  const progress = Math.min((seconds / (goalMinutes * 60)) * 100, 100);
  const goalReached = seconds >= goalMinutes * 60;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">⏱️ Practice Timer</h2>

      {/* Goal Setting */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Practice Goal: {goalMinutes} minutes
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={goalMinutes}
          onChange={(e) => setGoalMinutes(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isRunning}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5 min</span>
          <span>30 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-8 mb-6 text-white">
        <div className="text-center">
          <div className="text-7xl font-bold mb-4 font-mono">
            {formatTime(seconds)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/30 rounded-full h-3 mb-4">
            <div
              className="bg-white h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Goal Status */}
          <div className="text-lg">
            {goalReached ? (
              <span className="font-bold">🎉 Goal Reached! Great job!</span>
            ) : (
              <span>
                {Math.ceil((goalMinutes * 60 - seconds) / 60)} min to goal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={toggleTimer}
          className={`py-4 rounded-xl font-bold text-white text-lg transition-all ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button
          onClick={resetTimer}
          className="py-4 rounded-xl font-bold text-white bg-gray-500 hover:bg-gray-600 text-lg transition-all"
        >
          🔄 Reset
        </button>
      </div>

      {/* Complete Goal Button */}
      {goalReached && (
        <button
          onClick={completeGoal}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg transition-all mb-6"
        >
          ✅ Complete Goal & Start New Session
        </button>
      )}

      {/* Stats */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Goals Completed Today:</span>
          <span className="text-2xl font-bold text-purple-600">{completedGoals}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-700">Total Practice Today:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatTime(seconds + completedGoals * goalMinutes * 60)}
          </span>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">💡 Practice Tips:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Start with 15-20 minutes daily</li>
          <li>• Take short breaks every 10-15 minutes</li>
          <li>• Focus on quality over quantity</li>
          <li>• Practice at the same time each day</li>
        </ul>
      </div>
    </div>
  );
}
