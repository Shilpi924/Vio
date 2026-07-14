import { curriculum, getLevelById, isLevelUnlocked, calculateLevelProgress } from '../data/curriculum';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function CurriculumPage() {
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();
  const completedLessons = userProfile?.completedLessons || [];
  const currentLevel = 'level-1'; // Default to first level

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getLevelStatus = (levelId: string) => {
    if (levelId === currentLevel) return 'current';
    if (isLevelUnlocked(levelId, [])) return 'unlocked';
    return 'locked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-500';
      case 'unlocked': return 'bg-gray-300';
      case 'locked': return 'bg-gray-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Learning Path</h1>
        <p className="text-lg text-gray-700 mb-6">Follow a structured curriculum designed for violin mastery</p>

        {/* Current Level Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Level</h2>
              <p className="text-gray-600">{getLevelById(currentLevel)?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">
                {calculateLevelProgress(currentLevel, completedLessons).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateLevelProgress(currentLevel, completedLessons)}%` }}
            ></div>
          </div>
        </div>

        {/* Curriculum Levels */}
        <div className="space-y-6">
          {curriculum.map((level) => {
            const status = getLevelStatus(level.id);
            const progress = calculateLevelProgress(level.id, completedLessons);
            const isLocked = status === 'locked';

            return (
              <div
                key={level.id}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                  isLocked ? 'border-gray-200 opacity-60' : 'border-transparent hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Level Badge */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${getStatusColor(status)}`}>
                    {status === 'current' ? '▶' : level.badge}
                  </div>

                  {/* Level Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{level.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(level.difficulty)}`}>
                        {level.difficulty}
                      </span>
                      {status === 'current' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{level.description}</p>

                    {/* Progress Bar */}
                    {!isLocked && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Lessons */}
                    <div className="flex flex-wrap gap-2">
                      {level.lessons.map((lesson) => {
                        const isLessonCompleted = completedLessons.includes(lesson);
                        return (
                          <div
                            key={lesson}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              isLessonCompleted
                                ? 'bg-green-100 text-green-800'
                                : isLocked
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {isLessonCompleted ? '✓ ' : ''}{lesson}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* XP Reward */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">+{level.xpReward}</p>
                    <p className="text-sm text-gray-500">XP</p>
                  </div>
                </div>

                {/* Prerequisites */}
                {level.prerequisites.length > 0 && isLocked && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Requires: {level.prerequisites.map(prereq => getLevelById(prereq)?.name).join(' → ')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-3">💡 Learning Tips</h2>
          <ul className="space-y-2">
            <li>• Complete each level in order - they build on each other</li>
            <li>• Practice each lesson until you're comfortable before moving on</li>
            <li>• Review previous levels regularly to maintain your skills</li>
            <li>• Don't rush - mastery takes time and consistent practice</li>
            <li>• Use the free play mode to practice what you've learned</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
