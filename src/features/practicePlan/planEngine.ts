import type { UserProfile } from '../../types/userProfile';
import type {
  DailyPracticePlan,
  DailyPracticeTask,
  DiagnosticDimension,
  DiagnosticResult,
  PracticeSession,
} from '../../types';

export const localDateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const weakestDimension = (scores: DiagnosticResult['scores']): DiagnosticDimension =>
  (Object.entries(scores) as Array<[DiagnosticDimension, number]>)
    .sort((left, right) => left[1] - right[1])[0][0];

const focusTask: Record<DiagnosticDimension, Omit<DailyPracticeTask, 'id' | 'durationMinutes'>> = {
  pitch: {
    title: 'Open-string ear check',
    description: 'Listen, identify, and compare open-string pitches.',
    reason: 'Your pitch-listening score is the clearest growth opportunity.',
    path: '/ear-training',
    matchActivity: 'trainer',
    matchTitle: 'Open-string ear training',
  },
  rhythm: {
    title: 'Rhythm reset',
    description: 'Count simple patterns before applying them to the bow.',
    reason: 'A steadier internal pulse will make every piece easier.',
    path: '/rhythm-training',
    matchActivity: 'trainer',
    matchTitle: 'Read and count rhythm',
  },
  reading: {
    title: 'Note-reading sprint',
    description: 'Connect written notes to strings and first-position fingers.',
    reason: 'Faster note recognition will reduce stops during repertoire.',
    path: '/note-naming',
    matchActivity: 'trainer',
    matchTitle: 'Name notes on the violin',
  },
};

const dimensionBySessionTitle: Partial<Record<string, DiagnosticDimension>> = {
  'Open-string ear training': 'pitch',
  'Read and count rhythm': 'rhythm',
  'Name notes on the violin': 'reading',
};

const lessonSequence = [
  'open-strings',
  'twinkle-twinkle',
  'mary-had-little-lamb',
  'scales-g-major',
  'scales-d-major',
  'ode-to-joy',
  'canon-in-d',
];

export interface BuildDailyPlanInput {
  profile: UserProfile;
  diagnostic: DiagnosticResult;
  sessions: PracticeSession[];
  lessonTitles: Record<string, string>;
}

export function matchesPracticeTask(task: DailyPracticeTask, session: PracticeSession): boolean {
  if (task.matchLessonId && task.matchLessonId !== session.lessonId) return false;
  if (task.matchActivity && task.matchActivity !== session.activity) return false;
  if (task.matchTitle && task.matchTitle !== session.title) return false;
  return Boolean(task.matchLessonId || task.matchActivity || task.matchTitle);
}

export function buildDailyPlan({
  profile,
  diagnostic,
  sessions,
  lessonTitles,
}: BuildDailyPlanInput): DailyPracticePlan {
  const date = localDateKey();
  const todaysSessions = sessions.filter(
    (session) => session.profileId === profile.id && localDateKey(new Date(session.startedAt)) === date,
  );
  const recentSessions = sessions.filter((session) => session.profileId === profile.id).slice(0, 8);
  const recentSkillScores = recentSessions.reduce<Partial<Record<DiagnosticDimension, number[]>>>(
    (scores, session) => {
      const dimension = dimensionBySessionTitle[session.title];
      if (!dimension) return scores;
      scores[dimension] = [...(scores[dimension] ?? []), session.accuracy];
      return scores;
    },
    {},
  );
  const adjustedScores = (Object.keys(diagnostic.scores) as DiagnosticDimension[]).reduce(
    (scores, dimension) => {
      const results = recentSkillScores[dimension];
      const recentDimensionScore = results?.length
        ? results.reduce((total, score) => total + score, 0) / results.length
        : diagnostic.scores[dimension];
      scores[dimension] = Math.round((diagnostic.scores[dimension] * 0.6) + (recentDimensionScore * 0.4));
      return scores;
    },
    {} as DiagnosticResult['scores'],
  );
  const focus = weakestDimension(adjustedScores);
  const targetMinutes = diagnostic.targetMinutes;
  const focusMinutes = targetMinutes === 10 ? 3 : targetMinutes === 15 ? 4 : 5;
  const warmupMinutes = targetMinutes === 10 ? 2 : 3;
  const repertoireMinutes = targetMinutes - 2 - focusMinutes - warmupMinutes;
  const warmupLesson = profile.skillLevel === 'beginner'
    ? (profile.completedLessons.includes('open-strings') ? 'scales-g-major' : 'open-strings')
    : 'scales-d-major';
  const repertoireLesson = lessonSequence.find((lessonId) => !profile.completedLessons.includes(lessonId))
    ?? 'canon-in-d';
  const recentAccuracy = recentSessions.length
    ? Math.round(recentSessions.reduce((total, session) => total + session.accuracy, 0) / recentSessions.length)
    : null;

  const tasks: DailyPracticeTask[] = [
    {
      id: 'tuning',
      title: 'Tune all four strings',
      description: 'Check G, D, A, and E before playing.',
      reason: 'Reliable feedback starts with a reliably tuned violin.',
      durationMinutes: 2,
      path: '/tuner',
      matchActivity: 'tuner',
      matchTitle: 'Four-string tuning check',
    },
    {
      id: `focus-${focus}`,
      ...focusTask[focus],
      durationMinutes: focusMinutes,
    },
    {
      id: `warmup-${warmupLesson}`,
      title: lessonTitles[warmupLesson] ?? 'First-position warm-up',
      description: 'Play slowly enough to keep fingers relaxed and notes centered.',
      reason: 'A short technical warm-up prepares the exact movements used today.',
      durationMinutes: warmupMinutes,
      path: `/lessons/${warmupLesson}`,
      matchActivity: 'lesson',
      matchLessonId: warmupLesson,
    },
    {
      id: `repertoire-${repertoireLesson}`,
      title: lessonTitles[repertoireLesson] ?? 'Repertoire practice',
      description: 'Finish with a guided musical goal, then repeat the hardest notes.',
      reason: 'Technique becomes useful when it immediately supports real music.',
      durationMinutes: repertoireMinutes,
      path: `/lessons/${repertoireLesson}`,
      matchActivity: 'lesson',
      matchLessonId: repertoireLesson,
    },
  ];

  const completedTaskIds = tasks
    .filter((task) => todaysSessions.some((session) => matchesPracticeTask(task, session)))
    .map((task) => task.id);

  return {
    id: `${profile.id}_${date}`,
    profileId: profile.id,
    date,
    generatedAt: new Date().toISOString(),
    targetMinutes,
    focus,
    adaptationSummary: recentAccuracy === null
      ? `Starting with your ${focus} diagnostic result and a ${targetMinutes}-minute session.`
      : `Today’s ${focus} focus blends your diagnostic with a recent ${recentAccuracy}% practice average.`,
    tasks,
    completedTaskIds,
  };
}
