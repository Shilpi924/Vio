// Violin-specific data structures and constants

export type ViolinString = 'G' | 'D' | 'A' | 'E';
export type FingerNumber = 0 | 1 | 2 | 3 | 4; // 0 = open string, 1-4 = fingers
export type BowDirection = 'up' | 'down';
export type BowingTechnique = 'detache' | 'legato' | 'staccato' | 'spiccato' | 'martele' | 'sautillé';

// Violin string frequencies (Hz) - standard tuning
export const VIOLIN_STRING_FREQUENCIES: Record<ViolinString, number> = {
  G: 196.00,  // G3
  D: 293.66,  // D4
  A: 440.00,  // A4
  E: 659.25,  // E5
};

// Violin string colors for visualization
export const VIOLIN_STRING_COLORS: Record<ViolinString, string> = {
  G: '#8B4513',  // Brown
  D: '#A0522D',  // Sienna
  A: '#CD853F',  // Peru
  E: '#DEB887',  // Burlywood
};

// Note positions on each string (finger number -> note name)
export const STRING_NOTE_POSITIONS: Record<ViolinString, Record<FingerNumber, string>> = {
  G: {
    0: 'G3',
    1: 'A3',
    2: 'B3',
    3: 'C4',
    4: 'D4',
  },
  D: {
    0: 'D4',
    1: 'E4',
    2: 'F#4',
    3: 'G4',
    4: 'A4',
  },
  A: {
    0: 'A4',
    1: 'B4',
    2: 'C#5',
    3: 'D5',
    4: 'E5',
  },
  E: {
    0: 'E5',
    1: 'F#5',
    2: 'G#5',
    3: 'A5',
    4: 'B5',
  },
};

// Reverse mapping: note -> string and finger
export const NOTE_TO_STRING_FINGER: Record<string, { string: ViolinString; finger: FingerNumber }[]> = {
  'G3': [{ string: 'G', finger: 0 }],
  'A3': [{ string: 'G', finger: 1 }],
  'B3': [{ string: 'G', finger: 2 }],
  'C4': [{ string: 'G', finger: 3 }],
  'D4': [{ string: 'G', finger: 4 }, { string: 'D', finger: 0 }],
  'E4': [{ string: 'D', finger: 1 }],
  'F#4': [{ string: 'D', finger: 2 }],
  'G4': [{ string: 'D', finger: 3 }],
  'A4': [{ string: 'D', finger: 4 }, { string: 'A', finger: 0 }],
  'B4': [{ string: 'A', finger: 1 }],
  'C#5': [{ string: 'A', finger: 2 }],
  'D5': [{ string: 'A', finger: 3 }],
  'E5': [{ string: 'A', finger: 4 }, { string: 'E', finger: 0 }],
  'F#5': [{ string: 'E', finger: 1 }],
  'G#5': [{ string: 'E', finger: 2 }],
  'A5': [{ string: 'E', finger: 3 }],
  'B5': [{ string: 'E', finger: 4 }],
};

// Common violin scales with finger patterns
export const VIOLIN_SCALES = {
  // G Major (G string)
  'G-major-G': {
    name: 'G Major (G String)',
    notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3],
    string: 'G' as ViolinString,
  },
  // D Major (D string)
  'D-major-D': {
    name: 'D Major (D String)',
    notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3],
    string: 'D' as ViolinString,
  },
  // A Major (A string)
  'A-major-A': {
    name: 'A Major (A String)',
    notes: ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3],
    string: 'A' as ViolinString,
  },
  // G Major (two-octave)
  'G-major-2oct': {
    name: 'G Major (Two Octaves)',
    notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2],
    strings: ['G', 'G', 'G', 'G', 'G', 'D', 'D', 'D', 'D', 'A', 'A', 'A', 'A', 'E', 'E'] as ViolinString[],
  },
  // D Major (two-octave)
  'D-major-2oct': {
    name: 'D Major (Two Octaves)',
    notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6', 'D6'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2],
    strings: ['D', 'D', 'D', 'D', 'D', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'E', 'E'] as ViolinString[],
  },
  // A Major (two-octave)
  'A-major-2oct': {
    name: 'A Major (Two Octaves)',
    notes: ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5', 'B5', 'C#6', 'D6', 'E6', 'F#6', 'G#6', 'A6'],
    fingers: [0, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2],
    strings: ['A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'] as ViolinString[],
  },
};

// Bowing techniques with descriptions
export const BOWING_TECHNIQUES: Record<BowingTechnique, {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
}> = {
  detache: {
    name: 'Détaché',
    description: 'Each note is separated with a change of bow direction',
    difficulty: 'beginner',
    instructions: [
      'Start with the bow at the frog (near your hand)',
      'Draw the bow to the tip for the first note',
      'Change direction and draw back for the second note',
      'Keep the bow speed consistent',
      'Maintain even pressure throughout the bow stroke',
    ],
  },
  legato: {
    name: 'Legato',
    description: 'Smooth, connected notes without breaks',
    difficulty: 'beginner',
    instructions: [
      'Play multiple notes in one bow direction',
      'Keep the bow moving smoothly between notes',
      'Do not stop the bow between notes',
      'Keep the tone consistent across all notes',
    ],
  },
  staccato: {
    name: 'Staccato',
    description: 'Short, detached notes with clear separation',
    difficulty: 'intermediate',
    instructions: [
      'Start each note with a quick bow attack',
      'Stop the bow immediately after each note',
      'Keep the bow on the string between notes',
      'Use a quick, sharp motion',
    ],
  },
  spiccato: {
    name: 'Spiccato',
    description: 'Bouncing bow off the string',
    difficulty: 'advanced',
    instructions: [
      'Let the bow bounce naturally off the string',
      'Use a relaxed wrist and forearm',
      'Control the bounce with bow speed and pressure',
      'Start slowly and increase speed gradually',
    ],
  },
  martele: {
    name: 'Martelé',
    description: 'Accented, hammered strokes with clear stops',
    difficulty: 'intermediate',
    instructions: [
      'Start each note with a strong accent',
      'Stop the bow completely after each note',
      'Lift the bow slightly between notes',
      'Use more pressure at the beginning of each stroke',
    ],
  },
  sautillé: {
    name: 'Sautillé',
    description: 'Rapid, controlled bouncing near the frog',
    difficulty: 'advanced',
    instructions: [
      'Keep the bow near the frog',
      'Use a very fast, controlled bounce',
      'Keep your wrist flexible',
      'Practice with a metronome for consistency',
    ],
  },
};

// Left hand positions
export const LEFT_HAND_POSITIONS = {
  'first-position': {
    name: 'First Position',
    description: 'Basic position where first finger is one whole step above the open string',
    fingerSpacing: {
      1: 'whole step',
      2: 'whole step',
      3: 'half step',
      4: 'whole step',
    },
    notes: {
      G: ['G3', 'A3', 'B3', 'C4', 'D4'],
      D: ['D4', 'E4', 'F#4', 'G4', 'A4'],
      A: ['A4', 'B4', 'C#5', 'D5', 'E5'],
      E: ['E5', 'F#5', 'G#5', 'A5', 'B5'],
    },
  },
  'second-position': {
    name: 'Second Position',
    description: 'Hand moved up one whole step from first position',
    fingerSpacing: {
      1: 'whole step',
      2: 'whole step',
      3: 'half step',
      4: 'whole step',
    },
    notes: {
      G: ['A3', 'B3', 'C4', 'D4', 'E4'],
      D: ['E4', 'F#4', 'G4', 'A4', 'B4'],
      A: ['B4', 'C#5', 'D5', 'E5', 'F#5'],
      E: ['F#5', 'G#5', 'A5', 'B5', 'C#6'],
    },
  },
  'third-position': {
    name: 'Third Position',
    description: 'Hand moved up another whole step',
    fingerSpacing: {
      1: 'whole step',
      2: 'whole step',
      3: 'half step',
      4: 'whole step',
    },
    notes: {
      G: ['B3', 'C4', 'D4', 'E4', 'F#4'],
      D: ['F#4', 'G4', 'A4', 'B4', 'C#5'],
      A: ['C#5', 'D5', 'E5', 'F#5', 'G#5'],
      E: ['G#5', 'A5', 'B5', 'C#6', 'D6'],
    },
  },
};

// Common violin intervals with finger patterns
export const VIOLIN_INTERVALS = {
  'major-second': {
    name: 'Major Second',
    semitones: 2,
    fingerPattern: [0, 1],
    description: 'Whole step, adjacent fingers',
  },
  'minor-third': {
    name: 'Minor Third',
    semitones: 3,
    fingerPattern: [0, 2],
    description: 'One whole step and one half step',
  },
  'major-third': {
    name: 'Major Third',
    semitones: 4,
    fingerPattern: [0, 2] as number[],
    description: 'Two whole steps',
  },
  'perfect-fourth': {
    name: 'Perfect Fourth',
    semitones: 5,
    fingerPattern: [0, 3],
    description: 'String crossing or low 4 to high 1',
  },
  'perfect-fifth': {
    name: 'Perfect Fifth',
    semitones: 7,
    fingerPattern: [0, 0],
    description: 'Open string to next open string',
  },
  'octave': {
    name: 'Octave',
    semitones: 12,
    fingerPattern: [0, 4],
    description: 'Open string to 4th finger on next string',
  },
};

// Violin-specific practice exercises
export const VIOLIN_EXERCISES = {
  'open-strings': {
    name: 'Open String Practice',
    difficulty: 'beginner',
    description: 'Practice playing each open string with good tone',
    instructions: [
      'Hold the violin properly',
      'Place the bow on the G string',
      'Draw a full bow from frog to tip',
      'Repeat on D, A, and E strings',
      'Focus on keeping the bow straight',
      'Listen for a clear, resonant tone',
    ],
  },
  'finger-placement': {
    name: 'Finger Placement',
    difficulty: 'beginner',
    description: 'Learn where to place each finger on the fingerboard',
    instructions: [
      'Start with first finger on each string',
      'Press firmly but not too hard',
      'Check pitch with a tuner',
      'Practice second, third, and fourth fingers',
      'Keep fingers curved and relaxed',
    ],
  },
  'bow-angles': {
    name: 'Bow Angles',
    difficulty: 'beginner',
    description: 'Practice keeping the bow at the correct angle',
    instructions: [
      'Keep the bow perpendicular to the strings',
      'Practice slow bow strokes',
      'Watch in a mirror to check your form',
      'Keep your shoulder relaxed',
    ],
  },
  'string-crossing': {
    name: 'String Crossing',
    difficulty: 'intermediate',
    description: 'Practice moving smoothly between strings',
    instructions: [
      'Start with adjacent strings (G-D, D-A, A-E)',
      'Use a smooth, curved motion',
      'Keep the bow speed consistent',
      'Practice crossing at different bow positions',
    ],
  },
  'vibrato': {
    name: 'Vibrato',
    difficulty: 'advanced',
    description: 'Add expressive pitch variation to notes',
    instructions: [
      'Start with a relaxed hand and arm',
      'Practice the motion without the violin',
      'Apply to long notes on each string',
      'Start slow and increase speed gradually',
      'Keep the finger pressure consistent',
    ],
  },
};

// Helper function to get note frequency
export const getNoteFrequency = (note: string): number => {
  const noteRegex = /^([A-G]#?)(\d+)$/;
  const match = note.match(noteRegex);
  if (!match) return 440;

  const noteName = match[1];
  const octave = parseInt(match[2]);

  const noteToSemitone: Record<string, number> = {
    'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
    'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
  };

  const semitone = noteToSemitone[noteName] || 0;
  const a4Semitone = 9; // A4 is the 9th semitone
  const octaveDiff = octave - 4;
  const totalSemitones = semitone - a4Semitone + (octaveDiff * 12);

  return 440 * Math.pow(2, totalSemitones / 12);
};

// Helper function to find which string and finger to use for a note
export const findStringAndFinger = (note: string): { string: ViolinString; finger: FingerNumber } | null => {
  const positions = NOTE_TO_STRING_FINGER[note];
  if (positions && positions.length > 0) {
    // Return the first (usually easiest) position
    return positions[0];
  }
  return null;
};
