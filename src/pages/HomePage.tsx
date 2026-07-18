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

  // Simplified to 3 main actions for kids
  const mainActions = [
    { path: '/beginner-path', title: 'Learn', icon: '�', subtitle: 'Start from scratch', color: 'from-blue-400 to-blue-600' },
    { path: '/free-play', title: 'Play', icon: '🎵', subtitle: 'Free violin time', color: 'from-purple-400 to-purple-600' },
    { path: '/lessons', title: 'Songs', icon: '🎶', subtitle: 'Learn music', color: 'from-green-400 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Simple, fun header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">� Violin Kids</h1>
          <p className="text-xl text-gray-600">Learn violin, have fun!</p>
        </div>

        {/* Simple progress badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full px-6 py-3 shadow-md flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(statistics.totalPracticeTime)}</div>
              <div className="text-xs text-gray-500">Practice</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">🔥 {statistics.streak}</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
          </div>
        </div>

        {/* 3 Big, Colorful Buttons */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {mainActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`bg-gradient-to-r ${action.color} text-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95`}
            >
              <div className="text-5xl mb-2">{action.icon}</div>
              <div className="text-3xl font-bold">{action.title}</div>
              <div className="text-lg opacity-90">{action.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Simple call to action */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          {!userProfile || userProfile.completedLessons.length === 0 ? (
            <>
              <p className="text-2xl font-bold text-gray-800 mb-2">Ready to play your first song? 🎵</p>
              <button
                onClick={() => navigate('/beginner-path')}
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Start Learning →
              </button>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-800 mb-2">Great job! Keep going! ⭐</p>
              <p className="text-gray-600 mb-4">{userProfile.completedLessons.length} lessons done</p>
              <button
                onClick={() => navigate('/beginner-path')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all hover:scale-105"
              >
                Continue →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
