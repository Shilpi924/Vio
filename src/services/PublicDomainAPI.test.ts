import { describe, expect, it } from 'vitest';
import { CATALOG, publicDomainAPI } from './PublicDomainAPI';

describe('public-domain starter catalog', () => {
  it('has provenance and renderable MusicXML for every score', () => {
    for (const score of CATALOG) {
      expect(score.provenance).toMatch(/public domain/i);
      expect(score.musicXml).toContain('<score-partwise');
      expect(score.musicXml).toContain('<rights>Public domain</rights>');
    }
  });

  it('filters by query and difficulty', async () => {
    const results = await publicDomainAPI.searchScores('Beethoven', 'Beginner');
    expect(results.map((score) => score.id)).toEqual(['ode-to-joy']);
  });
});
