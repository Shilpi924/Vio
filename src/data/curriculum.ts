export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: string[];
  prerequisites: string[];
  xpReward: number;
  badge: string;
}

/**
 * Every curriculum item maps to a lesson that is currently shipped.
 * Add future levels only after their learning activities exist.
 */
export const curriculum: Level[] = [
  {
    id: 'level-1',
    name: 'Open strings & first melodies',
    description: 'Build a relaxed setup, recognize the four strings, and play short familiar melodies.',
    difficulty: 'beginner',
    lessons: ['open-strings', 'twinkle-twinkle', 'mary-had-little-lamb'],
    prerequisites: [],
    xpReward: 100,
    badge: '🎻',
  },
  {
    id: 'level-2',
    name: 'First-position foundations',
    description: 'Use first-position finger patterns in G, D, and A major.',
    difficulty: 'beginner',
    lessons: ['scales-g-major', 'scales-d-major', 'scales-a-major'],
    prerequisites: ['level-1'],
    xpReward: 150,
    badge: '🎵',
  },
  {
    id: 'level-3',
    name: 'Rhythm & string crossing',
    description: 'Apply steady pulse and clean string changes in complete melodies.',
    difficulty: 'beginner',
    lessons: ['ode-to-joy', 'row-row-row-your-boat', 'frere-jacques'],
    prerequisites: ['level-2'],
    xpReward: 200,
    badge: '🎶',
  },
  {
    id: 'level-4',
    name: 'Musical phrasing',
    description: 'Develop longer phrases, smoother bow distribution, and confident performance.',
    difficulty: 'intermediate',
    lessons: ['amazing-grace', 'canon-in-d', 'jingle-bells'],
    prerequisites: ['level-3'],
    xpReward: 300,
    badge: '🏆',
  },
];

export const getLevelById = (id: string): Level | undefined =>
  curriculum.find((level) => level.id === id);

export const isLevelComplete = (level: Level, completedLessons: string[]): boolean =>
  level.lessons.every((lesson) => completedLessons.includes(lesson));

export const isLevelUnlocked = (levelId: string, completedLevels: string[]): boolean => {
  const level = getLevelById(levelId);
  return Boolean(level?.prerequisites.every((prerequisite) => completedLevels.includes(prerequisite)));
};

export const calculateLevelProgress = (levelId: string, completedLessons: string[]): number => {
  const level = getLevelById(levelId);
  if (!level?.lessons.length) return 0;
  return (level.lessons.filter((lesson) => completedLessons.includes(lesson)).length / level.lessons.length) * 100;
};
