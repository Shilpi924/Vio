import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function StatisticsPage() {
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 75) return 'bg-blue-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const completedLessons = userProfile?.completedLessons || [];
  const totalXP = userProfile?.experiencePoints || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-lg text-gray-700 mb-6">Track your violin learning journey</p>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Practice Time */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Practice</span>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatTime(statistics.totalPracticeTime)}</p>
            <p className="text-sm text-gray-500 mt-1">Lifetime practice time</p>
          </div>

          {/* Notes Played */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Notes Played</span>
              <span className="text-2xl">🎵</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.notesPlayed.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total notes practiced</p>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Accuracy</span>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">{statistics.accuracy.toFixed(1)}%</p>
              <div className={`w-12 h-12 rounded-full ${getAccuracyColor(statistics.accuracy)}`}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Overall accuracy</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Current Streak</span>
              <span className="text-2xl">🔥</span>
            </div>
            <p className={`text-3xl font-bold ${getStreakColor(statistics.streak)}`}>
              {statistics.streak} days
            </p>
            <p className="text-sm text-gray-500 mt-1">Keep it up!</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lessons Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons Completed</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Completed</span>
                <span className="text-2xl font-bold text-purple-600">{completedLessons.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total XP Earned</span>
                <span className="text-2xl font-bold text-green-600">{totalXP.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Songs Completed</span>
                <span className="text-2xl font-bold text-blue-600">{statistics.songsCompleted.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {statistics.lastPracticeDate ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">📅</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Last Practice</p>
                    <p className="text-sm text-gray-600">
                      {new Date(statistics.lastPracticeDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🎻</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Practice Today</p>
                    <p className="text-sm text-gray-600">
                      {statistics.lastPracticeDate && new Date(statistics.lastPracticeDate).toDateString() === new Date().toDateString()
                        ? 'Yes! Keep it up!'
                        : 'Not yet today'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No practice sessions recorded yet. Start practicing to see your progress!</p>
            )}
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Note Reading</span>
                <span className="font-medium text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Intonation</span>
                <span className="font-medium text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rhythm</span>
                <span className="font-medium text-gray-900">82%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bowing Technique</span>
                <span className="font-medium text-gray-900">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scales</span>
                <span className="font-medium text-gray-900">55%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sight Reading</span>
                <span className="font-medium text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎻</div>
              <p className="text-sm font-medium text-yellow-900">First Note</p>
              <p className="text-xs text-yellow-700">Play your first note</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-medium text-green-900">Sharp Shooter</p>
              <p className="text-xs text-green-700">90% accuracy</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-sm font-medium text-blue-900">Week Warrior</p>
              <p className="text-xs text-blue-700">7-day streak</p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-4 text-center opacity-50">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-sm font-medium text-purple-900">Scholar</p>
              <p className="text-xs text-purple-700">Complete 10 lessons</p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg p-4 text-center opacity-50">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-medium text-pink-900">Master</p>
              <p className="text-xs text-pink-700">Complete all lessons</p>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 text-center opacity-50">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-medium text-gray-900">Virtuoso</p>
              <p className="text-xs text-gray-700">1000 XP</p>
            </div>
          </div>
        </div>

        {/* Practice Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">💡 Practice Tips</h2>
          <ul className="space-y-2">
            <li>• Aim for at least 15-30 minutes of practice daily</li>
            <li>• Focus on accuracy over speed - slow and steady wins the race</li>
            <li>• Review previous lessons before starting new ones</li>
            <li>• Record yourself to track your improvement over time</li>
            <li>• Take breaks to avoid fatigue and maintain focus</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
