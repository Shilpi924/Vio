import SkillTrainer from '../components/SkillTrainer';

export default function HandPositioningPage() {
  return <SkillTrainer title="Healthy left-hand setup" description="Use these checks as reminders, not as a replacement for a teacher. Stop if you feel pain." skill="Technique safety" items={[
    { prompt: 'How should the left thumb contact the neck?', options: ['Light and flexible', 'Clamped tightly', 'Hidden under the palm', 'Locked straight'], correct: 'Light and flexible', explanation: 'A light thumb supports mobility and reduces unnecessary tension.' },
    { prompt: 'What should you do if an exercise causes pain?', options: ['Stop and seek qualified guidance', 'Push through it', 'Practice faster', 'Grip harder'], correct: 'Stop and seek qualified guidance', explanation: 'Pain is not a normal training goal. A teacher or clinician should assess it.' },
    { prompt: 'The wrist is generally healthiest when it is…', options: ['Neutral rather than collapsed', 'Pressed against the violin', 'Sharply bent inward', 'Locked rigidly'], correct: 'Neutral rather than collapsed', explanation: 'A balanced wrist supports reach without excess strain.' },
  ]} />;
}
