import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function PracticeSessionSummary() {
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const sessions = useAppStore((state) =>
    state.practiceSessions.filter((session) => session.profileId === activeProfileId)
  );
  const [showDetails, setShowDetails] = useState(false);

  const getTotalPracticeTime = () => {
    return Math.round(sessions.reduce((total, session) => total + session.durationSeconds, 0) / 60);
  };

  const getAverageAccuracy = () => {
    if (sessions.length === 0) return 0;
    return Math.round(sessions.reduce((total, session) => total + session.accuracy, 0) / sessions.length);
  };

  const getMostFrequentActivity = () => {
    const activityCount: Record<string, number> = {};
    sessions.forEach(session => {
      activityCount[session.activity] = (activityCount[session.activity] || 0) + 1;
    });
    
    return Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Sessions</h2>
        <p className="text-gray-600">No practice sessions recorded yet. Start practicing to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Practice Sessions</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{getTotalPracticeTime()}m</div>
          <div className="text-sm text-gray-600">Total Time</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{getAverageAccuracy()}%</div>
          <div className="text-sm text-gray-600">Avg Accuracy</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
      </div>

      {/* Most Frequent Activity */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Most practiced:</span> {getMostFrequentActivity()}
        </p>
      </div>

      {/* Session Details */}
      {showDetails && (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {new Date(session.startedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">{Math.max(1, Math.round(session.durationSeconds / 60))} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{session.accuracy}% accuracy</p>
                  <p className="text-sm text-gray-600">{session.notesPlayed} notes played</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                  {session.activity.replace('-', ' ')}
                </span>
              </div>
              
              {session.lessonId && (
                <div className="mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {session.title}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
