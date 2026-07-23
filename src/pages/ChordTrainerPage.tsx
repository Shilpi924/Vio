import SkillTrainer from '../components/SkillTrainer';

export default function ChordTrainerPage() {
  return <SkillTrainer title="Double-stop foundations" description="Prepare two-note shapes slowly before attempting sustained double stops." skill="Harmony" items={[
    { prompt: 'Which open-string pair forms a perfect fifth?', options: ['G and D', 'G and A', 'D and E', 'G and E'], correct: 'G and D', explanation: 'All adjacent violin strings form perfect fifths.', audioNotes: ['G3','D4'] },
    { prompt: 'Before sustaining a double stop, first check…', options: ['Each string separately', 'Only bow speed', 'Only the upper note', 'The metronome volume'], correct: 'Each string separately', explanation: 'Checking each pitch separately makes intonation easier to diagnose.' },
    { prompt: 'A balanced double stop needs the bow to contact…', options: ['Both strings evenly', 'Only the lower string', 'Only the upper string', 'The fingerboard edge'], correct: 'Both strings evenly', explanation: 'The bow level must settle between the two string planes.' },
  ]} />;
}
