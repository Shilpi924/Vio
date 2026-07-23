import SkillTrainer from '../components/SkillTrainer';

export default function SightReadingPage() {
  return <SkillTrainer title="Read before you play" description="Scan rhythm, key and direction before putting the bow on the string." skill="Sight reading" items={[
    { prompt: 'What should you check first before sight-reading?', options: ['Tempo and key signature', 'The final note only', 'Finger color', 'Volume setting'], correct: 'Tempo and key signature', explanation: 'A quick scan prevents avoidable rhythm and pitch mistakes.' },
    { prompt: 'Four quarter notes in 4/4 fill how many measures?', options: ['One', 'Two', 'Three', 'Four'], correct: 'One', explanation: 'Four quarter-note beats fill one 4/4 measure.' },
    { prompt: 'If notes move upward on the staff, pitch generally moves…', options: ['Higher', 'Lower', 'Slower', 'Softer'], correct: 'Higher', explanation: 'Vertical position on the staff represents pitch height.' },
  ]} />;
}
