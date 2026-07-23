export interface PublicDomainScore {
  id: string;
  title: string;
  composer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  musicXml: string;
  provenance: string;
}

const toMusicXml = (title: string, composer: string, notes: string[]) => {
  const noteXml = notes.map((value) => {
    const match = value.match(/^([A-G])([#b]?)(\d)$/);
    if (!match) return '';
    const [, step, accidental, octave] = match;
    const alter = accidental === '#' ? '<alter>1</alter>' : accidental === 'b' ? '<alter>-1</alter>' : '';
    return `<note><pitch><step>${step}</step>${alter}<octave>${octave}</octave></pitch><duration>1</duration><type>quarter</type></note>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <work><work-title>${title}</work-title></work>
  <identification><creator type="composer">${composer}</creator><rights>Public domain</rights></identification>
  <part-list><score-part id="P1"><part-name>Violin</part-name></score-part></part-list>
  <part id="P1"><measure number="1"><attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${noteXml}</measure></part>
</score-partwise>`;
};

export const CATALOG: PublicDomainScore[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    composer: 'Traditional',
    difficulty: 'Beginner',
    category: 'Folk',
    musicXml: toMusicXml('Twinkle Twinkle Little Star', 'Traditional', ['A4','A4','E5','E5','F#5','F#5','E5']),
    provenance: 'Traditional melody; public domain.',
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    difficulty: 'Beginner',
    category: 'Classical',
    musicXml: toMusicXml('Ode to Joy', 'Ludwig van Beethoven', ['F#4','F#4','G4','A4','A4','G4','F#4','E4']),
    provenance: 'Beethoven, Symphony No. 9; public domain.',
  },
  {
    id: 'bach-minuet',
    title: 'Minuet in G',
    composer: 'Christian Petzold',
    difficulty: 'Intermediate',
    category: 'Baroque',
    musicXml: toMusicXml('Minuet in G', 'Christian Petzold', ['D5','G4','A4','B4','C5','D5','G4','G4']),
    provenance: 'BWV Anh. 114, attributed to Christian Petzold; public domain.',
  },
  {
    id: 'vivaldi-spring',
    title: 'Spring theme',
    composer: 'Antonio Vivaldi',
    difficulty: 'Intermediate',
    category: 'Baroque',
    musicXml: toMusicXml('Spring theme', 'Antonio Vivaldi', ['E5','G#5','G#5','G#5','F#5','E5','B5']),
    provenance: 'Vivaldi, The Four Seasons; public domain excerpt.',
  },
];

class PublicDomainAPI {
  async searchScores(query: string, difficulty?: string): Promise<PublicDomainScore[]> {
    const normalized = query.trim().toLowerCase();
    return CATALOG.filter((score) => {
      const matchesQuery = !normalized
        || score.title.toLowerCase().includes(normalized)
        || score.composer.toLowerCase().includes(normalized);
      const matchesDifficulty = !difficulty || difficulty === 'All' || score.difficulty === difficulty;
      return matchesQuery && matchesDifficulty;
    });
  }
}

export const publicDomainAPI = new PublicDomainAPI();
