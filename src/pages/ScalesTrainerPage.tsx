import SkillTrainer from '../components/SkillTrainer';

export default function ScalesTrainerPage() {
  return <SkillTrainer title="First-position scales" description="Hear scale patterns and connect key signatures to violin finger patterns." skill="Scales" items={[
    { prompt: 'Which notes form a one-octave G major scale?', options: ['G A B C D E F♯ G', 'G A B♭ C D E F G', 'G A C D E F G A', 'G B D G'], correct: 'G A B C D E F♯ G', explanation: 'G major contains one sharp: F♯.', audioNotes: ['G3','A3','B3','C4','D4','E4','F#4','G4'] },
    { prompt: 'Which open string begins the D major scale?', options: ['G', 'D', 'A', 'E'], correct: 'D', explanation: 'A one-octave D major scale begins on the open D string.', audioNotes: ['D4','E4','F#4','G4'] },
    { prompt: 'How many sharps are in A major?', options: ['One', 'Two', 'Three', 'Four'], correct: 'Three', explanation: 'A major uses F♯, C♯ and G♯.' },
  ]} />;
}
