import { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number;
  target: number;
  deadline: Date;
  completed: boolean;
}

const challenges: Challenge[] = [
  {
    id: 'practice-5-days',
    title: 'Practice Streak',
    description: 'Practice for 5 days this week',
    icon: '🔥',
    xpReward: 100,
    progress: 3,
    target: 5,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: 'complete-3-lessons',
    title: 'Lesson Master',
    description: 'Complete 3 lessons this week',
    icon: '📚',
    xpReward: 150,
    progress: 1,
    target: 3,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
  {
    id: 'accuracy-85',
    title: 'Precision Player',
    description: 'Achieve 85% accuracy in 5 sessions',
    icon: '🎯',
    xpReward: 200,
    progress: 2,
    target: 5,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    completed: false,
  },
];

export default function WeeklyChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const getDaysRemaining = (deadline: Date) => {
    const diff = deadline.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'from-green-500 to-emerald-600';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🏆 Weekly Challenges</h2>
        <span className="text-sm text-gray-600">
          {getDaysRemaining(challenges[0].deadline)} days remaining
        </span>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-102 ${
              challenge.completed
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{challenge.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{challenge.title}</h3>
                  <span className="text-sm font-semibold text-purple-600">
                    +{challenge.xpReward} XP
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getProgressColor(challenge.progress, challenge.target)} h-3 rounded-full transition-all`}
                      style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {challenge.completed && (
                  <div className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                    <span>✓</span>
                    <span>Completed!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="text-6xl">{selectedChallenge.icon}</div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedChallenge.title}</h3>
            <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="font-bold text-purple-600">
                  {selectedChallenge.progress}/{selectedChallenge.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`bg-gradient-to-r ${getProgressColor(selectedChallenge.progress, selectedChallenge.target)} h-4 rounded-full`}
                  style={{ width: `${Math.min((selectedChallenge.progress / selectedChallenge.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-purple-600">{selectedChallenge.xpReward}</div>
                <div className="text-xs text-gray-600">XP Reward</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-orange-600">{getDaysRemaining(selectedChallenge.deadline)}</div>
                <div className="text-xs text-gray-600">Days Left</div>
              </div>
            </div>

            {selectedChallenge.completed ? (
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-800 font-bold">🎉 Challenge Completed!</p>
                <p className="text-sm text-green-600 mt-1">
                  You earned {selectedChallenge.xpReward} XP
                </p>
              </div>
            ) : (
              <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
                Continue Challenge
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">💡 Challenge Tips:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Complete challenges to earn bonus XP</li>
          <li>• Challenges reset every Monday</li>
          <li>• Focus on one challenge at a time</li>
          <li>• Practice daily to maintain streaks</li>
        </ul>
      </div>
    </div>
  );
}
