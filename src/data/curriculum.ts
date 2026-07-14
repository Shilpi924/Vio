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

export const curriculum: Level[] = [
  {
    id: 'level-1',
    name: 'Getting Started',
    description: 'Learn the basics of violin playing - holding the instrument, bow hold, and open strings',
    difficulty: 'beginner',
    lessons: ['open-strings', 'bow-hold', 'violin-posture'],
    prerequisites: [],
    xpReward: 100,
    badge: '🎻',
  },
  {
    id: 'level-2',
    name: 'First Position',
    description: 'Master the fundamental notes and finger positions in first position',
    difficulty: 'beginner',
    lessons: ['finger-placement', 'g-major-scale', 'd-major-scale'],
    prerequisites: ['level-1'],
    xpReward: 150,
    badge: '🎵',
  },
  {
    id: 'level-3',
    name: 'Simple Songs',
    description: 'Play your first complete songs using open strings and first finger',
    difficulty: 'beginner',
    lessons: ['twinkle-twinkle', 'mary-had-little-lamb', 'happy-birthday'],
    prerequisites: ['level-2'],
    xpReward: 200,
    badge: '🎶',
  },
  {
    id: 'level-4',
    name: 'Bowing Basics',
    description: 'Learn fundamental bowing techniques - détaché, legato, and string crossing',
    difficulty: 'intermediate',
    lessons: ['detache', 'legato', 'string-crossing'],
    prerequisites: ['level-3'],
    xpReward: 300,
    badge: '🎼',
  },
  {
    id: 'level-5',
    name: 'Scale Mastery',
    description: 'Master major and minor scales in first position',
    difficulty: 'intermediate',
    lessons: ['a-major-scale', 'e-minor-scale', 'd-major-2oct'],
    prerequisites: ['level-4'],
    xpReward: 350,
    badge: '🎹',
  },
  {
    id: 'level-6',
    name: 'Intermediate Songs',
    description: 'Play more complex melodies with multiple strings and finger patterns',
    difficulty: 'intermediate',
    lessons: ['ode-to-joy', 'canon-in-d', 'amazing-grace'],
    prerequisites: ['level-5'],
    xpReward: 400,
    badge: '🎵',
  },
  {
    id: 'level-7',
    name: 'Rhythm & Timing',
    description: 'Develop strong rhythmic skills and timing accuracy',
    difficulty: 'intermediate',
    lessons: ['rhythm-exercises', 'metronome-practice', 'syncopation'],
    prerequisites: ['level-6'],
    xpReward: 500,
    badge: '🎼',
  },
  {
    id: 'level-8',
    name: 'Advanced Techniques',
    description: 'Master advanced playing techniques including vibrato and shifting',
    difficulty: 'advanced',
    lessons: ['vibrato-intro', 'shifting-basics', 'third-position'],
    prerequisites: ['level-7'],
    xpReward: 600,
    badge: '🎶',
  },
  {
    id: 'level-9',
    name: 'Master Pieces',
    description: 'Play classical and popular masterpieces with expression',
    difficulty: 'advanced',
    lessons: ['fur-elise', 'meditation-thais', 'bach-solo'],
    prerequisites: ['level-8'],
    xpReward: 750,
    badge: '🏆',
  },
  {
    id: 'level-10',
    name: 'Virtuoso',
    description: 'Achieve mastery of the violin with advanced repertoire and techniques',
    difficulty: 'advanced',
    lessons: ['paginini-caprices', 'bach-sonatas', 'concerto-excerpts'],
    prerequisites: ['level-9'],
    xpReward: 1000,
    badge: '👑',
  },
];

export interface UserProgress {
  currentLevel: string;
  completedLessons: string[];
  completedLevels: string[];
  totalXP: number;
  badges: string[];
}

export const getLevelById = (id: string): Level | undefined => {
  return curriculum.find((level) => level.id === id);
};

export const getNextLevel = (currentLevelId: string): Level | undefined => {
  const currentIndex = curriculum.findIndex((level) => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === curriculum.length - 1) return undefined;
  return curriculum[currentIndex + 1];
};

export const isLevelUnlocked = (levelId: string, completedLevels: string[]): boolean => {
  const level = getLevelById(levelId);
  if (!level) return false;
  return level.prerequisites.every((prereq) => completedLevels.includes(prereq));
};

export const calculateLevelProgress = (levelId: string, completedLessons: string[]): number => {
  const level = getLevelById(levelId);
  if (!level) return 0;
  const completedInLevel = level.lessons.filter((lesson) => completedLessons.includes(lesson)).length;
  return (completedInLevel / level.lessons.length) * 100;
};
