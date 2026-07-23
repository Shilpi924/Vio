import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  DailyPracticePlan,
  DiagnosticResult,
  Lesson,
  Settings,
  Statistics,
  MIDIDevice,
  LessonProgress,
  PracticeSession,
} from '../types';
import { localDateKey, matchesPracticeTask } from '../features/practicePlan/planEngine';

interface AppStore extends AppState {
  // Practice session state
  setIsPlaying: (playing: boolean) => void;
  setTempo: (tempo: number) => void;
  customLessons: Lesson[];
  addCustomLesson: (lesson: Lesson) => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;

  // Statistics
  statistics: Statistics;
  updateStatistics: (stats: Partial<Statistics>) => void;
  incrementPracticeTime: (seconds: number) => void;
  recordNotePlayed: (correct: boolean) => void;
  completeLesson: (lessonId: string) => void;
  practiceSessions: PracticeSession[];
  recordPracticeSession: (session: Omit<PracticeSession, 'id'>) => void;
  diagnosticResults: Record<string, DiagnosticResult>;
  saveDiagnosticResult: (result: DiagnosticResult) => void;
  dailyPracticePlans: Record<string, DailyPracticePlan>;
  saveDailyPracticePlan: (plan: DailyPracticePlan) => void;

  // MIDI
  midiDevices: MIDIDevice[];
  setMidiDevices: (devices: MIDIDevice[]) => void;
  addMidiDevice: (device: MIDIDevice) => void;
  removeMidiDevice: (deviceId: string) => void;

  // Lesson Progress
  lessonProgress: Record<string, LessonProgress>;
  updateLessonProgress: (lessonId: string, progress: Partial<LessonProgress>) => void;

  // Audio
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

const defaultSettings: Settings = {
  showFingerboardLabels: true,
  showNoteNames: true,
  useSharps: true,
  darkMode: false,
  selectedMIDIDevice: null,
  audioVolume: 70,
  animationSpeed: 1,
  fingerColors: {
    index: '#ef4444',
    middle: '#f97316',
    ring: '#eab308',
    pinky: '#3b82f6',
  },
  highPerformanceGraphics: true,
  claudeApiKey: '',
  backgroundMusic: true,
  language: 'en',
};

const defaultStatistics: Statistics = {
  totalPracticeTime: 0,
  notesPlayed: 0,
  correctNotes: 0,
  accuracy: 0,
  streak: 0,
  songsCompleted: [],
  hardestMeasures: [],
  lastPracticeDate: new Date(),
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial practice session state
      isPlaying: false,
      tempo: 80,

      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setTempo: (tempo) => set({ tempo }),
      
      // Custom Lessons
      customLessons: [],
      addCustomLesson: (lesson) => set((state) => ({
        customLessons: [...state.customLessons, lesson]
      })),

      // Settings
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Statistics
      statistics: defaultStatistics,
      updateStatistics: (newStats) =>
        set((state) => ({
          statistics: { ...state.statistics, ...newStats },
        })),
      incrementPracticeTime: (seconds) =>
        set((state) => ({
          statistics: {
            ...state.statistics,
            totalPracticeTime: state.statistics.totalPracticeTime + seconds,
            lastPracticeDate: new Date(),
          },
        })),
      recordNotePlayed: (correct) =>
        set((state) => {
          const newNotesPlayed = state.statistics.notesPlayed + 1;
          const newCorrectNotes = correct ? state.statistics.correctNotes + 1 : state.statistics.correctNotes;
          const newAccuracy = Math.round((newCorrectNotes / newNotesPlayed) * 100);
          const newStreak = correct ? state.statistics.streak + 1 : 0;

          return {
            statistics: {
              ...state.statistics,
              notesPlayed: newNotesPlayed,
              correctNotes: newCorrectNotes,
              accuracy: newAccuracy,
              streak: newStreak,
            },
          };
        }),
      completeLesson: (lessonId) =>
        set((state) => ({
          statistics: {
            ...state.statistics,
            songsCompleted: state.statistics.songsCompleted.includes(lessonId)
              ? state.statistics.songsCompleted
              : [...state.statistics.songsCompleted, lessonId],
          },
        })),
      practiceSessions: [],
      diagnosticResults: {},
      saveDiagnosticResult: (result) =>
        set((state) => ({
          diagnosticResults: { ...state.diagnosticResults, [result.profileId]: result },
        })),
      dailyPracticePlans: {},
      saveDailyPracticePlan: (plan) =>
        set((state) => ({
          dailyPracticePlans: { ...state.dailyPracticePlans, [plan.profileId]: plan },
        })),
      recordPracticeSession: (session) =>
        set((state) => {
          const nextSession: PracticeSession = {
            ...session,
            id: `practice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          };
          const notesPlayed = state.statistics.notesPlayed + session.notesPlayed;
          const correctNotes = state.statistics.correctNotes + session.correctNotes;
          const activePlan = state.dailyPracticePlans[session.profileId];
          const sessionDate = localDateKey(new Date(session.startedAt));
          const updatedPlans = activePlan?.date === sessionDate
            ? {
                ...state.dailyPracticePlans,
                [session.profileId]: {
                  ...activePlan,
                  completedTaskIds: Array.from(new Set([
                    ...activePlan.completedTaskIds,
                    ...activePlan.tasks
                      .filter((task) => matchesPracticeTask(task, nextSession))
                      .map((task) => task.id),
                  ])),
                },
              }
            : state.dailyPracticePlans;
          return {
            practiceSessions: [nextSession, ...state.practiceSessions].slice(0, 100),
            dailyPracticePlans: updatedPlans,
            statistics: {
              ...state.statistics,
              totalPracticeTime: state.statistics.totalPracticeTime + session.durationSeconds,
              notesPlayed,
              correctNotes,
              accuracy: notesPlayed > 0 ? Math.round((correctNotes / notesPlayed) * 100) : 0,
              hardestMeasures: Array.from(new Set([
                ...session.hardestNotes,
                ...state.statistics.hardestMeasures,
              ])).slice(0, 12),
              lastPracticeDate: new Date(),
            },
          };
        }),

      // MIDI
      midiDevices: [],
      setMidiDevices: (devices) => set({ midiDevices: devices }),
      addMidiDevice: (device) =>
        set((state) => ({
          midiDevices: [...state.midiDevices.filter((d) => d.id !== device.id), device],
        })),
      removeMidiDevice: (deviceId) =>
        set((state) => ({
          midiDevices: state.midiDevices.filter((d) => d.id !== deviceId),
        })),

      // Lesson Progress
      lessonProgress: {},
      updateLessonProgress: (lessonId, progress) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              ...state.lessonProgress[lessonId],
              ...progress,
            },
          },
        })),

      // Audio
      audioEnabled: true,
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
    }),
    {
      name: 'violin-mentor-storage',
      partialize: (state) => ({
        settings: state.settings,
        statistics: state.statistics,
        lessonProgress: state.lessonProgress,
        customLessons: state.customLessons,
        practiceSessions: state.practiceSessions,
        diagnosticResults: state.diagnosticResults,
        dailyPracticePlans: state.dailyPracticePlans,
      }),
    }
  )
);
