export interface Tutorial {
  id: string;
  title: string;
  category: 'basics' | 'technique' | 'music-theory' | 'practice' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  description: string;
  sections: TutorialSection[];
}

export interface TutorialSection {
  title: string;
  content: string;
  tips?: string[];
  commonMistakes?: string[];
  practiceExercise?: string;
}

export const violinTutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Violin',
    category: 'basics',
    difficulty: 'beginner',
    duration: 15,
    description: 'Learn the basics of holding and caring for your violin',
    sections: [
      {
        title: 'Parts of the Violin',
        content: `The violin has four main parts you need to know:
        
        1. **Body**: The wooden hollow part that amplifies the sound
        2. **Neck**: The long piece extending from the body
        3. **Fingerboard**: The black strip on the neck where you place your fingers
        4. **Strings**: Four strings tuned to G, D, A, and E (from lowest to highest)
        
        The violin also has a bridge, sound post, tailpiece, chin rest, and scroll.`,
        tips: [
          'Always handle your violin carefully',
          'Keep it in its case when not in use',
          'Never leave it in extreme temperatures',
        ],
      },
      {
        title: 'Holding the Violin',
        content: `Proper posture is essential for good violin playing:

        1. Stand or sit with your back straight
        2. Place the violin on your left shoulder
        3. Rest your chin on the chin rest
        4. Hold the violin with your left hand - thumb on the neck, fingers curved
        5. The violin should be parallel to the floor`,
        tips: [
          'Relax your shoulders - don\'t raise them',
          'Your left wrist should be straight',
          'The violin should feel balanced without gripping too tight',
        ],
        commonMistakes: [
          'Holding the violin too low (it should be at eye level)',
          'Gripping the neck too tightly',
          'Not using the chin rest properly',
        ],
      },
      {
        title: 'Tuning Your Violin',
        content: `The four strings are tuned in perfect fifths:
        - G string: G3 (196 Hz)
        - D string: D4 (293.66 Hz)
        - A string: A4 (440 Hz)
        - E string: E5 (659.25 Hz)

        Use fine tuners for small adjustments and pegs for larger changes.`,
        tips: [
          'Always tune from below the note',
          'Start with the A string (440 Hz) as reference',
          'Use a tuner or tuning app for accuracy',
        ],
        practiceExercise: 'Practice tuning each string using a tuner. Listen carefully to the pitch and adjust until it matches perfectly.',
      },
    ],
  },
  {
    id: 'bow-hold',
    title: 'The Bow Hold',
    category: 'technique',
    difficulty: 'beginner',
    duration: 20,
    description: 'Learn how to hold the bow correctly for beautiful tone',
    sections: [
      {
        title: 'Parts of the Bow',
        content: `The bow has several important parts:
        
        1. **Stick**: The long wooden part
        2. **Frog**: The end where you hold the bow
        3. **Screw**: Adjusts bow hair tension
        4. **Hair**: The horsehair that contacts the strings
        5. **Pad**: Where your thumb rests`,
      },
      {
        title: 'Basic Bow Hold',
        content: `Follow these steps for a proper bow hold:

        1. Relax your right hand
        2. Place your thumb on the pad (between the stick and frog)
        3. Curve your fingers over the stick
        4. Your pinky should rest on top of the stick
        5. Keep your fingers flexible and relaxed`,
        tips: [
          'Your thumb should be bent, not straight',
          'Don\'t grip the bow too tightly',
          'Keep your wrist flexible',
          'Imagine holding a small bird - firm but gentle',
        ],
        commonMistakes: [
          'Gripping the bow too tightly',
          'Straight thumb instead of curved',
          'Tension in the fingers and wrist',
          'Pinky not resting on the stick',
        ],
      },
      {
        title: 'Bow Tension',
        content: `Proper bow tension is crucial:
        - Too loose: hair won't contact strings properly
        - Too tight: can damage the bow and affect tone
        
        The hair should be about a pencil's width from the stick when tightened.`,
        tips: [
          'Always loosen the bow when not playing',
          'Check tension before each practice session',
          'Adjust with the screw at the frog',
        ],
      },
    ],
  },
  {
    id: 'bowing-techniques',
    title: 'Basic Bowing Techniques',
    category: 'technique',
    difficulty: 'beginner',
    duration: 25,
    description: 'Master the fundamental bowing strokes',
    sections: [
      {
        title: 'Détaché (Detached)',
        content: `Détaché is the most basic bow stroke. Each note gets a separate bow stroke.

        Technique:
        1. Start at the frog (near your hand)
        2. Draw the bow to the tip for the first note
        3. Change direction and draw back for the second note
        4. Keep bow speed consistent
        5. Maintain even pressure throughout`,
        tips: [
          'Keep the bow perpendicular to the strings',
          'Use the full bow length when possible',
          'Keep your elbow at the same height',
        ],
        practiceExercise: 'Practice long, slow bows on each open string. Count to 4 while drawing the bow from frog to tip, then 4 while returning.',
      },
      {
        title: 'Legato (Smooth)',
        content: `Legato means playing notes smoothly and connectedly.

        Technique:
        1. Play multiple notes in one bow direction
        2. Keep the bow moving smoothly between notes
        3. Don't stop the bow between notes
        4. Maintain consistent tone`,
        tips: [
          'Think of the bow as one continuous motion',
          'Keep the bow speed steady',
          'Don\'t change bow direction between notes',
        ],
        practiceExercise: 'Play a scale using one bow direction for ascending notes and another for descending.',
      },
      {
        title: 'String Crossing',
        content: `Moving between strings requires practice:

        Technique:
        1. Use a smooth, curved motion
        2. Keep your arm level with the string you're playing
        3. Practice crossing between adjacent strings first
        4. Maintain bow speed during the crossing`,
        tips: [
          'Practice slowly at first',
          'Use a mirror to check your form',
          'Keep your shoulder relaxed',
        ],
        commonMistakes: [
          'Jerky movements between strings',
          'Lifting the bow off the strings',
          'Changing bow speed during crossing',
        ],
        practiceExercise: 'Practice crossing between G-D, D-A, and A-E strings. Play 4 beats on each string.',
      },
    ],
  },
  {
    id: 'left-hand-technique',
    title: 'Left Hand Technique',
    category: 'technique',
    difficulty: 'beginner',
    duration: 30,
    description: 'Develop proper left hand placement and finger action',
    sections: [
      {
        title: 'Hand Position',
        content: `Proper left hand position is essential for good intonation:

        1. Your thumb should be opposite your second finger
        2. Keep your thumb curved, not straight
        3. Your wrist should be straight, not bent
        4. Fingers should be curved and press from above
        5. Each finger should land on its tip`,
        tips: [
          'Imagine holding a small ball in your palm',
          'Keep your fingers relaxed when not pressing',
          'Don\'t press harder than necessary',
        ],
        commonMistakes: [
          'Flat fingers instead of curved',
          'Thumb gripping the neck',
          'Wrist bent inward or outward',
          'Pressing too hard on the strings',
        ],
      },
      {
        title: 'Finger Placement',
        content: `In first position:
        - First finger: one whole step above open string
        - Second finger: one whole step above first finger
        - Third finger: half step above second finger
        - Fourth finger: one whole step above third finger

        This pattern creates a major scale on each string.`,
        tips: [
          'Use your ear to check pitch',
          'Practice with a tuner at first',
          'Keep fingers close to the fingerboard',
        ],
        practiceExercise: 'Play each finger on each string, checking with a tuner. Practice the G major scale (G-A-B-C-D-E-F#-G).',
      },
      {
        title: 'Finger Action',
        content: `Good finger action is key to clean playing:

        1. Lift fingers straight up, not sideways
        2. Drop fingers with controlled weight
        3. Keep other fingers close to the string when not playing
        4. Practice lifting and dropping each finger independently`,
        tips: [
          'Think of your fingers as little hammers',
          'Keep your hand relaxed',
          'Don\'t lift fingers higher than necessary',
        ],
        practiceExercise: 'Practice "finger taps" - tap each finger on the fingerboard without making sound, focusing on the motion.',
      },
    ],
  },
  {
    id: 'reading-music',
    title: 'Reading Music for Violin',
    category: 'music-theory',
    difficulty: 'beginner',
    duration: 20,
    description: 'Learn to read violin sheet music',
    sections: [
      {
        title: 'The Staff',
        content: `Violin music is written on the treble clef staff:
        
        - The staff has 5 lines and 4 spaces
        - Notes are placed on lines or spaces
        - Higher notes are written higher on the staff
        - The treble clef circles around the G line (second from bottom)`,
      },
      {
        title: 'Note Names on the Staff',
        content: `From bottom to top:
        Lines: E - G - B - D - F
        Spaces: F - A - C - E
        
        Mnemonic for lines: "Every Good Boy Does Fine"
        Mnemonic for spaces: "F A C E" spells "face"`,
        tips: [
          'Learn the open string notes first: G (second line), D (fourth space), A (fifth line), E (above the staff)',
          'Practice identifying notes daily',
        ],
      },
      {
        title: 'Rhythm Basics',
        content: `Common note values:
        - Whole note: 4 beats
        - Half note: 2 beats
        - Quarter note: 1 beat
        - Eighth note: 1/2 beat
        - Sixteenth note: 1/4 beat`,
        tips: [
          'Count out loud when practicing',
          'Use a metronome to develop steady rhythm',
        ],
        practiceExercise: 'Clap rhythms from simple sheet music. Count "1" for quarter notes, "1-2" for half notes, etc.',
      },
    ],
  },
  {
    id: 'first-songs',
    title: 'Your First Songs',
    category: 'practice',
    difficulty: 'beginner',
    duration: 30,
    description: 'Play simple melodies using open strings and first finger',
    sections: [
      {
        title: 'Twinkle Twinkle Little Star',
        content: `This classic uses only the A string and E string:
        
        A-A-E-E-F#-F#-E (Twinkle twinkle little star)
        D-D-C#-C#-B-B-A (How I wonder what you are)
        
        All notes are on open strings or first finger.`,
        tips: [
          'Start slowly and gradually increase speed',
          'Focus on clean tone and intonation',
          'Use long, smooth bows',
        ],
        practiceExercise: 'Practice each phrase separately until comfortable, then connect them.',
      },
      {
        title: 'Mary Had a Little Lamb',
        content: `Uses G and D strings:
        
        E-D-C-D-E-E-E (Mary had a little lamb)
        D-D-D-E-G-G (Little lamb, little lamb)
        
        Practice string crossings between G and D strings.`,
        tips: [
          'Listen carefully to pitch',
          'Keep bow speed consistent',
          'Practice string crossings slowly',
        ],
      },
      {
        title: 'Practice Routine',
        content: `Daily practice should include:
        
        1. Warm-up (5 min): Open strings, long bows
        2. Scales (5 min): G major scale
        3. Exercises (5 min): Finger placement, bow control
        4. Songs (10 min): Work on current pieces
        5. Review (5 min): Play previous songs`,
        tips: [
          'Consistency is more important than duration',
          'Focus on quality over quantity',
          'Record yourself to track progress',
        ],
      },
    ],
  },
  {
    id: 'scales',
    title: 'Violin Scales',
    category: 'practice',
    difficulty: 'beginner',
    duration: 25,
    description: 'Master essential violin scales',
    sections: [
      {
        title: 'G Major Scale',
        content: `One octave on G and D strings:
        
        G (open) - A (1) - B (2) - C (3) - D (4) on G string
        E (1) - F# (2) - G (3) on D string
        
        Finger pattern: 0-1-2-3-4, 1-2-3`,
        tips: [
          'Keep fingers curved',
          'Use full bows',
          'Listen for whole steps and half steps',
        ],
        practiceExercise: 'Play the scale ascending and descending. Use a metronome at 60 BPM.',
      },
      {
        title: 'D Major Scale',
        content: `One octave on D and A strings:
        
        D (open) - E (1) - F# (2) - G (3) - A (4) on D string
        B (1) - C# (2) - D (3) on A string`,
        tips: [
          'Same finger pattern as G major',
          'Practice string crossings',
          'Keep tone consistent across strings',
        ],
      },
      {
        title: 'A Major Scale',
        content: `One octave on A and E strings:
        
        A (open) - B (1) - C# (2) - D (3) - E (4) on A string
        F# (1) - G# (2) - A (3) on E string`,
        tips: [
          'Watch your intonation on the E string',
          'The E string is thinner and requires lighter touch',
        ],
      },
    ],
  },
  {
    id: 'vibrato',
    title: 'Introduction to Vibrato',
    category: 'advanced',
    difficulty: 'intermediate',
    duration: 20,
    description: 'Add expressive vibrato to your playing',
    sections: [
      {
        title: 'What is Vibrato?',
        content: `Vibrato is a slight, rapid variation in pitch that adds warmth and expression to your tone.

        It's created by oscillating your hand back and forth while maintaining finger contact with the string.`,
      },
      {
        title: 'Preparing for Vibrato',
        content: `Before learning vibrato, you should:
        1. Have solid intonation
        2. Be comfortable in first position
        3. Have relaxed left hand technique
        4. Have good bow control`,
        tips: [
          'Don\'t rush vibrato - it takes time to develop',
          'Practice without the violin first',
        ],
      },
      {
        title: 'Basic Vibrato Exercise',
        content: `1. Place your finger on a note (e.g., A on G string)
        2. Relax your hand and arm
        3. Practice the oscillation motion without the violin
        4. Apply the motion to the violin with very slow oscillations
        5. Gradually increase speed as you become comfortable`,
        tips: [
          'Start with very slow, wide oscillations',
          'Keep your finger pressing firmly but not too hard',
          'Maintain bow contact while vibrating',
        ],
        practiceExercise: 'Practice vibrato on long notes (4-8 beats). Start with 2 oscillations per beat and gradually increase.',
      },
    ],
  },
  {
    id: 'practice-tips',
    title: 'Effective Practice Strategies',
    category: 'practice',
    difficulty: 'beginner',
    duration: 15,
    description: 'Learn how to practice efficiently and make steady progress',
    sections: [
      {
        title: 'Practice Environment',
        content: `Create a good practice space:
        - Quiet area with good lighting
        - Comfortable chair or stand
        - Music stand at eye level
        - Tuner and metronome nearby
        - Mirror to check posture`,
      },
      {
        title: 'Practice Structure',
        content: `Effective practice sessions:
        1. **Warm-up** (5-10 min): Open strings, scales
        2. **Technique** (10-15 min): Exercises, etudes
        3. **Repertoire** (15-20 min): Songs, pieces
        4. **Cool-down** (5 min): Slow, relaxed playing`,
        tips: [
          'Shorter, frequent practice is better than long, infrequent sessions',
          'Focus on one thing at a time',
          'Take breaks to avoid fatigue',
        ],
      },
      {
        title: 'Troubleshooting',
        content: `Common problems and solutions:
        
        - **Scratchy sound**: Check bow pressure and speed
        - **Poor intonation**: Practice with a tuner, listen carefully
        - **Tension**: Relax shoulders, breathe deeply
        - **Inconsistent rhythm**: Use a metronome`,
        tips: [
          'Record yourself to identify problems',
          'Slow down difficult passages',
          'Break complex pieces into smaller sections',
        ],
      },
    ],
  },
];

export const getTutorialById = (id: string): Tutorial | undefined => {
  return violinTutorials.find(t => t.id === id);
};

export const getTutorialsByCategory = (category: Tutorial['category']): Tutorial[] => {
  return violinTutorials.filter(t => t.category === category);
};

export const getTutorialsByDifficulty = (difficulty: Tutorial['difficulty']): Tutorial[] => {
  return violinTutorials.filter(t => t.difficulty === difficulty);
};
