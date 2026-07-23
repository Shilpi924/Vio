import { describe, expect, it } from 'vitest';
import type { DiagnosticResult, PracticeSession } from '../../types';
import type { UserProfile } from '../../types/userProfile';
import { buildDailyPlan, matchesPracticeTask } from './planEngine';

const profile: UserProfile = {
  id: 'learner',
  name: 'Learner',
  age: 12,
  ageGroup: '9-12',
  skillLevel: 'beginner',
  learningGoal: 'fun',
  practiceFrequency: 'daily',
  favoriteGenres: [],
  completedLessons: [],
  totalPracticeTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  level: 1,
  experiencePoints: 0,
  achievements: [],
  badges: [],
  practiceGoals: { dailyMinutes: 15, weeklySongs: 2, monthlyAccuracy: 80 },
  preferences: { showAnimations: true, soundEffects: true, darkMode: false, language: 'en' },
};

const diagnostic: DiagnosticResult = {
  id: 'diagnostic',
  profileId: profile.id,
  completedAt: new Date().toISOString(),
  targetMinutes: 15,
  scores: { pitch: 25, rhythm: 75, reading: 100 },
};

const lessonTitles = {
  'open-strings': 'Open Strings',
  'scales-g-major': 'G Major Scale',
  'twinkle-twinkle': 'Twinkle, Twinkle',
};

const session = (overrides: Partial<PracticeSession>): PracticeSession => ({
  id: 'session',
  profileId: profile.id,
  startedAt: new Date().toISOString(),
  durationSeconds: 180,
  activity: 'trainer',
  title: 'Open-string ear training',
  notesPlayed: 6,
  correctNotes: 6,
  accuracy: 100,
  hardestNotes: [],
  completed: true,
  ...overrides,
});

describe('daily practice plan engine', () => {
  it('builds an exact-time sequence around the weakest diagnostic skill', () => {
    const plan = buildDailyPlan({ profile, diagnostic, sessions: [], lessonTitles });

    expect(plan.focus).toBe('pitch');
    expect(plan.tasks.reduce((total, task) => total + task.durationMinutes, 0)).toBe(15);
    expect(plan.tasks).toHaveLength(4);
  });

  it('marks a task complete from a matching real practice session', () => {
    const plan = buildDailyPlan({ profile, diagnostic, sessions: [session({})], lessonTitles });

    expect(plan.completedTaskIds).toContain('focus-pitch');
    expect(matchesPracticeTask(plan.tasks[1], session({}))).toBe(true);
  });

  it('shifts tomorrow-facing focus when recent practice improves a weak skill', () => {
    const sessions = [
      session({ title: 'Open-string ear training', accuracy: 100 }),
      session({ id: 'rhythm', title: 'Read and count rhythm', accuracy: 0 }),
    ];
    const plan = buildDailyPlan({ profile, diagnostic, sessions, lessonTitles });

    expect(plan.focus).toBe('rhythm');
    expect(plan.adaptationSummary).toContain('blends your diagnostic');
  });
});
