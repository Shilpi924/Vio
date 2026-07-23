import SkillTrainer from '../components/SkillTrainer';

export default function NoteNamingPage() {
  return <SkillTrainer title="Name notes on the violin" description="Connect strings, fingers and written pitch." skill="Note reading" items={[
    { prompt: 'What note is first finger on the A string in the usual beginner pattern?', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'A plus a whole step gives B.' },
    { prompt: 'What note is third finger on the D string?', options: ['E', 'F♯', 'G', 'A'], correct: 'G', explanation: 'In first position, third finger on D is G.' },
    { prompt: 'Which written note matches the open highest string?', options: ['G3', 'D4', 'A4', 'E5'], correct: 'E5', explanation: 'The E string is the violin’s highest open string.' },
  ]} />;
}
