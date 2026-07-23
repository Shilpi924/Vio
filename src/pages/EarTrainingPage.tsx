import SkillTrainer from '../components/SkillTrainer';

export default function EarTrainingPage() {
  return <SkillTrainer title="Open-string ear training" description="Listen before answering. Build a reliable connection between sound, string and note name." skill="Ear training" items={[
    { prompt: 'Which open string did you hear?', options: ['G', 'D', 'A', 'E'], correct: 'G', explanation: 'G3 is the violin’s lowest open string.', audioNotes: ['G3'] },
    { prompt: 'Which open string did you hear?', options: ['G', 'D', 'A', 'E'], correct: 'A', explanation: 'A4 is the standard tuning reference at 440 Hz.', audioNotes: ['A4'] },
    { prompt: 'Did the second note move higher or lower?', options: ['Higher', 'Lower', 'Same pitch', 'Cannot tell'], correct: 'Higher', explanation: 'D4 to A4 rises by a perfect fifth.', audioNotes: ['D4','A4'] },
  ]} />;
}
