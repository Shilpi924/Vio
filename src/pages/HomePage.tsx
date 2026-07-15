import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const quickActions = [
    { path: '/free-play', title: 'Free Play', icon: '🎻', description: 'Practice freely with virtual fingerboard', color: 'from-purple-500 to-indigo-600' },
    { path: '/tutorials', title: 'Tutorials', icon: '📚', description: 'Learn step-by-step techniques', color: 'from-blue-500 to-cyan-600' },
    { path: '/curriculum', title: 'Learning Path', icon: '🎯', description: 'Follow structured lessons', color: 'from-green-500 to-emerald-600' },
    { path: '/statistics', title: 'Progress', icon: '📊', description: 'Track your achievements', color: 'from-orange-500 to-red-600' },
  ];

  const practiceTools = [
    { path: '/tuner', title: 'Violin Tuner', icon: '🎻', description: 'Tune your violin strings perfectly', color: 'from-red-500 to-pink-600' },
    { path: '/timer', title: 'Practice Timer', icon: '⏱️', description: 'Track your practice sessions', color: 'from-yellow-500 to-orange-600' },
    { path: '/metronome', title: 'Metronome', icon: '🎵', description: 'Keep perfect rhythm while practicing', color: 'from-teal-500 to-cyan-600' },
    { path: '/achievements', title: 'Achievements', icon: '🏆', description: 'Earn badges and rewards', color: 'from-purple-500 to-pink-600' },
  ];

  const parentTools = [
    { path: '/parent-dashboard', title: 'Parent Dashboard', icon: '👨‍👩‍👧', description: 'Track your child\'s progress', color: 'from-indigo-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Violin Mentor! 🎻</h1>
          <p className="text-lg text-gray-700">Your journey to mastering the violin starts here</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                ⏱️
              </div>
              <div>
                <p className="text-sm text-gray-600">Practice Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(statistics.totalPracticeTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.streak} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.accuracy.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              aria-label={`Open ${action.title}`}
              className={`bg-gradient-to-br ${action.color} text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left`}
            >
              <div className="text-4xl mb-3">{action.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          ))}
        </div>

        {/* Practice Tools */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Practice Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {practiceTools.map((tool) => (
            <button
              key={tool.path}
              onClick={() => navigate(tool.path)}
              aria-label={`Open ${tool.title}`}
              className={`bg-gradient-to-br ${tool.color} text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left`}
            >
              <div className="text-4xl mb-3">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{tool.title}</h3>
              <p className="text-sm opacity-90">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Parent Tools */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Parents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {parentTools.map((tool) => (
            <button
              key={tool.path}
              onClick={() => navigate(tool.path)}
              aria-label={`Open ${tool.title}`}
              className={`bg-gradient-to-br ${tool.color} text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left`}
            >
              <div className="text-4xl mb-3">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{tool.title}</h3>
              <p className="text-sm opacity-90">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Continue Learning */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Continue Learning</h2>
          {!userProfile || userProfile.completedLessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't started any lessons yet!</p>
              <button
                onClick={() => navigate('/curriculum')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Start Your First Lesson
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Lessons Completed</p>
                  <p className="text-sm text-gray-600">{userProfile.completedLessons.length} lessons</p>
                </div>
                <button
                  onClick={() => navigate('/curriculum')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">💡 Daily Tip</h2>
          <p className="text-purple-100">
            Consistency is key to learning violin. Try to practice for at least 15-20 minutes every day, even if it's just reviewing scales or open strings.
          </p>
        </div>
      </div>
    </div>
  );
}
