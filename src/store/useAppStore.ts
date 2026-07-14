import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Lesson, Settings, Statistics, MIDIDevice, LessonProgress } from '../types';

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
      }),
    }
  )
);
