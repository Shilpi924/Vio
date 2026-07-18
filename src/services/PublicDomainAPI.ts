export interface PublicDomainScore {
  id: string;
  title: string;
  composer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  url: string;
}

export const CATALOG: PublicDomainScore[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    composer: 'Traditional',
    difficulty: 'Beginner',
    category: 'Folk',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'ode-to-joy',
    title: 'Ode to Joy',
    composer: 'Ludwig van Beethoven',
    difficulty: 'Beginner',
    category: 'Classical',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml' // Placeholder valid XML
  },
  {
    id: 'bach-minuet',
    title: 'Minuet in G',
    composer: 'J.S. Bach',
    difficulty: 'Intermediate',
    category: 'Baroque',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'vivaldi-spring',
    title: 'Spring (The Four Seasons)',
    composer: 'Antonio Vivaldi',
    difficulty: 'Intermediate',
    category: 'Baroque',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'mozart-kleine',
    title: 'Eine kleine Nachtmusik',
    composer: 'W.A. Mozart',
    difficulty: 'Intermediate',
    category: 'Classical',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'paganini-caprice',
    title: 'Caprice No. 24',
    composer: 'Niccolò Paganini',
    difficulty: 'Advanced',
    category: 'Romantic',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'canon-in-d',
    title: 'Canon in D',
    composer: 'Johann Pachelbel',
    difficulty: 'Beginner',
    category: 'Baroque',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'swan-lake',
    title: 'Swan Lake Theme',
    composer: 'Pyotr Ilyich Tchaikovsky',
    difficulty: 'Intermediate',
    category: 'Romantic',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'meditation',
    title: 'Méditation (Thaïs)',
    composer: 'Jules Massenet',
    difficulty: 'Advanced',
    category: 'Romantic',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  },
  {
    id: 'schindler',
    title: 'Theme from Schindler\'s List',
    composer: 'John Williams',
    difficulty: 'Intermediate',
    category: 'Contemporary',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  }
];

class PublicDomainAPI {
  async searchScores(query: string, difficulty?: string): Promise<PublicDomainScore[]> {
    // Simulate network delay for a real API feel
    await new Promise(resolve => setTimeout(resolve, 500));

    let results = CATALOG;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(score => 
        score.title.toLowerCase().includes(q) || 
        score.composer.toLowerCase().includes(q)
      );
    }

    if (difficulty && difficulty !== 'All') {
      results = results.filter(score => score.difficulty === difficulty);
    }

    return results;
  }
}

export const publicDomainAPI = new PublicDomainAPI();
