import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useNavigate } from 'react-router-dom';

export default function StatisticsPage() {
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const completedLessons = userProfile?.completedLessons || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎉 Your Progress</h1>
          <p className="text-lg text-gray-600">Look how much you've learned!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-blue-600">{formatTime(statistics.totalPracticeTime)}</div>
            <div className="text-sm text-gray-500">Practice Time</div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-500">{statistics.streak}</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">�</div>
            <div className="text-3xl font-bold text-purple-600">{statistics.notesPlayed.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Notes Played</div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-green-600">{completedLessons.length}</div>
            <div className="text-sm text-gray-500">Lessons Done</div>
          </div>
        </div>

        {/* Achievement */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Amazing Work!</h2>
          <p className="text-gray-600 mb-4">You're doing great! Keep practicing every day.</p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4">
            <p className="text-lg font-bold">Accuracy: {statistics.accuracy.toFixed(0)}%</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">💡 Tips</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Practice for 15-20 minutes every day</p>
            <p>• Take your time - accuracy is more important than speed</p>
            <p>• Have fun! Music should be enjoyable</p>
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
