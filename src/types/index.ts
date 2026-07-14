export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export type FingerNumber = 0 | 1 | 2 | 3 | 4; // 0 = open string, 1-4 = fingers
export type Hand = 'left'; // Violin is primarily played with left hand on fingerboard

export type ViolinString = 'G' | 'D' | 'A' | 'E'; // Violin strings (from lowest to highest)
export type StringNumber = ViolinString; // Alias for compatibility

export type KeyState = 'idle' | 'highlighted' | 'pressed' | 'correct' | 'incorrect' | 'disabled';

export interface Note {
  note: string; // e.g., "G4", "A5"
  duration: number; // in beats
  finger: FingerNumber;
  hand: Hand;
  string?: StringNumber; // Which string to play
  position?: number; // Position on the fingerboard
}

export interface Lesson {
  id: string;
  title: string;
  tempo: number;
  notes: Note[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  source: 'public-domain' | 'user-uploaded' | 'built-in';
  sourceName?: string;
  focus?: string[];
  tags?: string[];
  questTrack?: 'starter' | 'songs' | 'rhythm' | 'classics' | 'performance';
  synopsis?: string;
  practiceTip?: string;
  ageBand?: 'kids' | 'teens' | 'all';
}

export type PracticeMode = 'guided' | 'performance' | 'slow-practice' | 'bowing' | 'loop';

export interface Statistics {
  totalPracticeTime: number; // in seconds
  notesPlayed: number;
  correctNotes: number;
  accuracy: number; // percentage
  streak: number;
  songsCompleted: string[];
  hardestMeasures: string[];
  lastPracticeDate: Date;
}

export interface Settings {
  showFingerboardLabels: boolean;
  showNoteNames: boolean;
  useSharps: boolean; // false for flats
  darkMode: boolean;
  selectedMIDIDevice: string | null;
  audioVolume: number;
  animationSpeed: number;
  fingerColors: {
    index: string;
    middle: string;
    ring: string;
    pinky: string;
  };
  highPerformanceGraphics?: boolean;
  claudeApiKey?: string;
  backgroundMusic?: boolean;
  language?: string;
}

export interface MIDIDevice {
  id: string;
  name: string;
  manufacturer?: string;
  state: 'connected' | 'disconnected';
}

export interface LessonProgress {
  lessonId: string;
  currentNoteIndex: number;
  completed: boolean;
  accuracy: number;
  attempts: number;
}

export interface MusicCatalogSource {
  id: string;
  name: string;
  type: 'built-in' | 'public-domain' | 'metadata' | 'scanner';
  description: string;
  access: 'ready' | 'bring-your-key' | 'manual-import';
  formats: string[];
  website: string;
  notes: string;
}

export interface RecommendedTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: string[];
}

export interface AppState {
  isPlaying: boolean;
  tempo: number;
}

export interface RhythmExercise {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeSignature: [number, number]; // e.g., [4, 4]
  tempo: number;
  sequence: { type: 'note' | 'rest'; duration: number }[]; // duration in beats (e.g., 1 for quarter, 0.5 for eighth)
}
