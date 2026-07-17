import { useUserProfileStore } from '../store/useUserProfileStore';

interface DifficultyProgressProps {
  showUnlockedFeatures?: boolean;
}

export default function DifficultyProgress({ showUnlockedFeatures = false }: DifficultyProgressProps) {
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const getCurrentDifficulty = useUserProfileStore((state) => state.getCurrentDifficulty);
  const getUnlockedFeatures = useUserProfileStore((state) => state.getUnlockedFeatures);
  
  const profile = getActiveProfile();
  const currentDifficulty = getCurrentDifficulty();
  const unlockedFeatures = getUnlockedFeatures();
  
  if (!profile) return null;
  
  const difficultyColors = {
    beginner: 'from-green-500 to-emerald-600',
    intermediate: 'from-blue-500 to-indigo-600',
    advanced: 'from-purple-500 to-pink-600',
    expert: 'from-yellow-500 to-orange-600',
  };
  
  const difficultyEmojis = {
    beginner: '🌱',
    intermediate: '🌿',
    advanced: '🌳',
    expert: '🏆',
  };
  
  const featureLabels: Record<string, string> = {
    'basic-lessons': 'Basic Lessons',
    'tuner': 'Violin Tuner',
    'metronome': 'Metronome',
    'note-matching-game': 'Note Matching Game',
    'intermediate-lessons': 'Intermediate Lessons',
    'practice-mode': 'Practice Mode',
    'advanced-lessons': 'Advanced Lessons',
    'expert-lessons': 'Expert Lessons',
    'performance-mode': 'Performance Mode',
    'all-features': 'All Features Unlocked',
  };
  
  const nextUnlock = getNextUnlock(profile.level);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${difficultyColors[currentDifficulty]} text-white font-semibold`}>
          {difficultyEmojis[currentDifficulty]} {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
        </div>
      </div>
      
      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">Level {profile.level}</span>
          <span className="text-sm text-gray-600">{profile.experiencePoints % 1000}/1000 XP</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(profile.experiencePoints % 1000) / 10}%` }}
          />
        </div>
      </div>
      
      {/* Next Unlock */}
      {nextUnlock && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-bold">🎯 Next unlock at Level {nextUnlock.level}:</span> {nextUnlock.feature}
          </p>
        </div>
      )}
      
      {/* Unlocked Features */}
      {showUnlockedFeatures && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Unlocked Features</h3>
          <div className="grid grid-cols-2 gap-2">
            {unlockedFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-green-800">{featureLabels[feature] || feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getNextUnlock(currentLevel: number): { level: number; feature: string } | null {
  const unlocks = [
    { level: 3, feature: 'Note Matching Game' },
    { level: 5, feature: 'Intermediate Lessons & Practice Mode' },
    { level: 7, feature: 'Advanced Lessons' },
    { level: 10, feature: 'Expert Lessons & Performance Mode' },
    { level: 15, feature: 'All Features' },
  ];
  
  return unlocks.find(unlock => unlock.level > currentLevel) || null;
}
