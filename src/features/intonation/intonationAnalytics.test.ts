import { describe, expect, it } from 'vitest';
import type { PracticeSession } from '../../types';
import { buildIntonationInsights } from './intonationAnalytics';

const makeSession = (id: string, cents: number, passed = true): PracticeSession => ({
  id,
  profileId: 'learner',
  startedAt: new Date(`2026-07-${id === 'one' ? '20' : '21'}T12:00:00Z`).toISOString(),
  durationSeconds: 120,
  activity: 'trainer',
  title: 'Intonation Coach: First-position orbit',
  notesPlayed: 2,
  correctNotes: passed ? 2 : 1,
  accuracy: passed ? 100 : 50,
  hardestNotes: ['E4'],
  completed: true,
  intonationDetails: [
    { note: 'E4', string: 'D', finger: 1, cents, struggleFrames: Math.abs(cents), passed, phase: 'flight' },
    { note: 'B4', string: 'A', finger: 1, cents: 0, struggleFrames: 1, passed: true, phase: 'flight' },
  ],
});

describe('intonation analytics', () => {
  it('returns an empty state without detailed sessions', () => {
    expect(buildIntonationInsights([]).hasData).toBe(false);
  });

  it('summarizes note, string, finger, and directional bias', () => {
    const insights = buildIntonationInsights([makeSession('one', 10)]);

    expect(insights.hasData).toBe(true);
    expect(insights.biasLabel).toBe('Tends sharp');
    expect(insights.noteMetrics).toHaveLength(2);
    expect(insights.stringMetrics.map((metric) => metric.key)).toEqual(['D', 'A']);
    expect(insights.fingerMetrics[0].attempts).toBe(2);
  });

  it('calculates a trend across sessions', () => {
    const insights = buildIntonationInsights([
      makeSession('one', 20, false),
      makeSession('two', 2, true),
    ]);

    expect(insights.trend).toHaveLength(2);
    expect(insights.improvement).toBeGreaterThan(0);
  });
});
