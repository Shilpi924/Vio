import SkillTrainer from '../components/SkillTrainer';

export default function IntervalTrainingPage() {
  return <SkillTrainer title="Recognize violin intervals" description="Listen to the distance between two pitches." skill="Intervals" items={[
    { prompt: 'What interval did you hear?', options: ['Unison', 'Major second', 'Perfect fifth', 'Octave'], correct: 'Perfect fifth', explanation: 'Adjacent open violin strings are tuned a perfect fifth apart.', audioNotes: ['D4','A4'] },
    { prompt: 'What interval did you hear?', options: ['Minor second', 'Major second', 'Perfect fourth', 'Octave'], correct: 'Major second', explanation: 'G to A spans a major second.', audioNotes: ['G4','A4'] },
    { prompt: 'Which pair is an octave?', options: ['A3–A4', 'D4–A4', 'G3–D4', 'A4–B4'], correct: 'A3–A4', explanation: 'An octave repeats the same pitch class twelve semitones higher.' },
  ]} />;
}
