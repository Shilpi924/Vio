import { useState, useEffect } from 'react';
import { useUserProfileStore } from '../store/useUserProfileStore';

interface PracticeSession {
  id: string;
  date: Date;
  duration: number; // in minutes
  activities: string[];
  accuracy: number;
  notesPlayed: number;
  lessonsCompleted: string[];
}

export default function PracticeSessionSummary() {
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Generate mock practice sessions based on user profile
    const profile = getActiveProfile();
    if (profile) {
      const mockSessions: PracticeSession[] = [];
      const activities = ['Tuner', 'Free Play', 'Note Matching', 'Lessons', 'Songs'];
      
      // Generate sessions based on practice time
      for (let i = 0; i < Math.min(profile.completedLessons.length, 5); i++) {
        mockSessions.push({
          id: `session_${i}`,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          duration: Math.floor(Math.random() * 30) + 15,
          activities: activities.slice(0, Math.floor(Math.random() * 3) + 1),
          accuracy: Math.floor(Math.random() * 30) + 70,
          notesPlayed: Math.floor(Math.random() * 50) + 20,
          lessonsCompleted: profile.completedLessons.slice(0, Math.floor(Math.random() * 2) + 1),
        });
      }
      
      setSessions(mockSessions);
    }
  }, [getActiveProfile]);

  const getTotalPracticeTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const getAverageAccuracy = () => {
    if (sessions.length === 0) return 0;
    return Math.round(sessions.reduce((total, session) => total + session.accuracy, 0) / sessions.length);
  };

  const getMostFrequentActivity = () => {
    const activityCount: Record<string, number> = {};
    sessions.forEach(session => {
      session.activities.forEach(activity => {
        activityCount[activity] = (activityCount[activity] || 0) + 1;
      });
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
                    {session.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">{session.duration} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{session.accuracy}% accuracy</p>
                  <p className="text-sm text-gray-600">{session.notesPlayed} notes played</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {session.activities.map((activity) => (
                  <span key={activity} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {activity}
                  </span>
                ))}
              </div>
              
              {session.lessonsCompleted.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Lessons completed:</p>
                  <div className="flex flex-wrap gap-1">
                    {session.lessonsCompleted.map((lesson) => (
                      <span key={lesson} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {lesson}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
