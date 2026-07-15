import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'first-note',
    title: 'First Note',
    description: 'Play your very first note',
    icon: '🎵',
    unlocked: true,
    unlockedDate: new Date(),
    rarity: 'common',
  },
  {
    id: 'first-lesson',
    title: 'Eager Student',
    description: 'Complete your first lesson',
    icon: '📚',
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'streak-3',
    title: 'Week Warrior',
    description: 'Practice for 3 days in a row',
    icon: '🔥',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'streak-7',
    title: 'Dedicated',
    description: 'Practice for 7 days in a row',
    icon: '⭐',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'accuracy-90',
    title: 'Sharp Shooter',
    description: 'Achieve 90% accuracy in a session',
    icon: '🎯',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'practice-30',
    title: 'Practice Makes Perfect',
    description: 'Practice for 30 minutes in one session',
    icon: '⏱️',
    unlocked: false,
    rarity: 'common',
  },
  {
    id: 'lessons-10',
    title: 'Scholar',
    description: 'Complete 10 lessons',
    icon: '🎓',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'tuner-master',
    title: 'Perfect Pitch',
    description: 'Tune your violin perfectly 10 times',
    icon: '🎻',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: 'xp-1000',
    title: 'Virtuoso',
    description: 'Earn 1000 XP',
    icon: '🏆',
    unlocked: false,
    rarity: 'legendary',
  },
];

const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-500';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-orange-500';
  }
};

const getRarityBorder = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'border-gray-400';
    case 'rare': return 'border-blue-500';
    case 'epic': return 'border-purple-500';
    case 'legendary': return 'border-yellow-500';
  }
};

export default function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Achievements</h2>
      <p className="text-gray-600 mb-6">
        Unlocked: {unlockedCount}/{totalCount}
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            onClick={() => setSelectedAchievement(achievement)}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              achievement.unlocked
                ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)}`
                : 'bg-gray-100 border-gray-300 opacity-50'
            }`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">{achievement.title}</h3>
            <p className="text-xs text-gray-700 line-clamp-2">{achievement.description}</p>
            {achievement.unlocked && (
              <div className="absolute top-2 right-2 text-xs bg-white/80 px-2 py-1 rounded-full font-medium">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRarityColor(selectedAchievement.rarity)} flex items-center justify-center text-4xl`}>
                {selectedAchievement.icon}
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedAchievement.title}</h3>
            <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(selectedAchievement.rarity)} text-white`}>
                {selectedAchievement.rarity.toUpperCase()}
              </span>
            </div>
            {selectedAchievement.unlocked ? (
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium">🎉 Unlocked!</p>
                {selectedAchievement.unlockedDate && (
                  <p className="text-sm text-green-600 mt-1">
                    {selectedAchievement.unlockedDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600">🔒 Not yet unlocked</p>
                <p className="text-sm text-gray-500 mt-1">Keep practicing to earn this!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">💡 How to Earn:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Practice daily to build your streak</li>
          <li>• Complete lessons to earn XP</li>
          <li>• Use the tuner and practice tools</li>
          <li>• Aim for high accuracy in exercises</li>
        </ul>
      </div>
    </div>
  );
}
