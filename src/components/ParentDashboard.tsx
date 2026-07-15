import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function ParentDashboard() {
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Mock practice history data
  const practiceHistory = [
    { date: new Date('2024-01-15'), duration: 25, accuracy: 85, lessons: 2 },
    { date: new Date('2024-01-14'), duration: 30, accuracy: 90, lessons: 1 },
    { date: new Date('2024-01-13'), duration: 20, accuracy: 78, lessons: 3 },
    { date: new Date('2024-01-12'), duration: 35, accuracy: 92, lessons: 2 },
    { date: new Date('2024-01-11'), duration: 15, accuracy: 88, lessons: 1 },
    { date: new Date('2024-01-10'), duration: 28, accuracy: 82, lessons: 2 },
    { date: new Date('2024-01-09'), duration: 22, accuracy: 86, lessons: 1 },
  ];

  const totalPracticeTime = practiceHistory.reduce((sum, day) => sum + day.duration * 60, 0);
  const averageAccuracy = Math.round(practiceHistory.reduce((sum, day) => sum + day.accuracy, 0) / practiceHistory.length);
  const totalLessons = practiceHistory.reduce((sum, day) => sum + day.lessons, 0);

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (accuracy: number) => {
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 80) return 'Good';
    if (accuracy >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">👨‍👩‍👧 Parent Dashboard</h1>
        <p className="text-lg text-gray-700 mb-8">Track your child's violin learning progress</p>

        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                ⏱️
              </div>
              <span className="text-sm text-gray-600">Total Practice</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatTime(totalPracticeTime)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                🎯
              </div>
              <span className="text-sm text-gray-600">Avg Accuracy</span>
            </div>
            <p className={`text-3xl font-bold ${getPerformanceColor(averageAccuracy)}`}>
              {averageAccuracy}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                📚
              </div>
              <span className="text-sm text-gray-600">Lessons Done</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalLessons}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                🔥
              </div>
              <span className="text-sm text-gray-600">Current Streak</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.streak} days</p>
          </div>
        </div>

        {/* Practice History Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Practice History</h2>
          <div className="space-y-4">
            {practiceHistory.map((day, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {formatDate(day.date)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{day.duration} min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(day.duration / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-32 text-center">
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className={`font-bold ${getPerformanceColor(day.accuracy)}`}>
                    {day.accuracy}%
                  </div>
                </div>
                <div className="w-24 text-center">
                  <div className="text-sm text-gray-600 mb-1">Lessons</div>
                  <div className="font-bold text-gray-900">{day.lessons}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills Progress</h2>
          <div className="space-y-4">
            {[
              { skill: 'Note Reading', progress: 75, color: 'from-blue-500 to-blue-600' },
              { skill: 'Rhythm', progress: 60, color: 'from-green-500 to-green-600' },
              { skill: 'Intonation', progress: 85, color: 'from-purple-500 to-purple-600' },
              { skill: 'Bowing Technique', progress: 45, color: 'from-orange-500 to-orange-600' },
              { skill: 'Scales', progress: 70, color: 'from-pink-500 to-pink-600' },
            ].map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">{item.skill}</span>
                  <span className="text-gray-600">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-semibold mb-4">💡 Recommendations</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <span>Great consistency! Your child has practiced every day this week.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Focus more on bowing technique - this is showing as an area for improvement.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <span>Consider increasing practice sessions to 30 minutes for better progress.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <span>Accuracy is excellent! Keep up the good work on intonation.</span>
            </li>
          </ul>
        </div>

        {/* Export Report Button */}
        <div className="mt-8 text-center">
          <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-purple-600">
            📄 Export Progress Report
          </button>
        </div>
      </div>
    </div>
  );
}
