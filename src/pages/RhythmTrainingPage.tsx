import SkillTrainer from '../components/SkillTrainer';

export default function RhythmTrainingPage() {
  return <SkillTrainer title="Read and count rhythm" description="Build timing vocabulary before applying it to the bow." skill="Rhythm" items={[
    { prompt: 'How many quarter-note beats fit in a 4/4 measure?', options: ['2', '3', '4', '8'], correct: '4', explanation: 'The top number gives four beats; the bottom number makes the quarter note the beat.' },
    { prompt: 'Two eighth notes equal…', options: ['One quarter note', 'One half note', 'Two measures', 'One whole note'], correct: 'One quarter note', explanation: 'Each eighth note lasts half of a quarter-note beat.' },
    { prompt: 'What is the safest first response when rhythm falls apart?', options: ['Slow down and subdivide', 'Play louder', 'Skip the rests', 'Remove the metronome forever'], correct: 'Slow down and subdivide', explanation: 'Slower counting reveals where timing becomes unclear.' },
  ]} />;
}
