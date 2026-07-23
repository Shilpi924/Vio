import { describe, expect, it } from 'vitest';
import { buildExpectedBeats, classifyBeatDelta, matchDetectedOnsets, summarizePulse, RHYTHM_PULSE_PATTERNS } from './rhythmPulse';

describe('rhythm pulse helpers', () => {
  it('builds beat targets only for tap slots', () => {
    const expected = buildExpectedBeats(RHYTHM_PULSE_PATTERNS[1], 60, 1000, 80);
    expect(expected).toHaveLength(6);
    expect(expected[0].expectedMs).toBe(1080);
  });

  it('matches detected onsets to the nearest beats in order', () => {
    const expected = buildExpectedBeats(RHYTHM_PULSE_PATTERNS[0], 120, 0, 0);
    const matches = matchDetectedOnsets(expected, [10, 490, 1010, 1495], 140);
    expect(matches).toHaveLength(8);
    expect(matches.slice(0, 4).every((match) => match.quality !== 'missed')).toBe(true);
  });

  it('summarizes centered hits, misses and the rescue lane', () => {
    const summary = summarizePulse([
      { beatIndex: 0, expectedMs: 0, detectedMs: 10, deltaMs: 10, quality: 'centered' },
      { beatIndex: 1, expectedMs: 500, quality: 'missed' },
      { beatIndex: 2, expectedMs: 1000, detectedMs: 1130, deltaMs: 130, quality: 'late' },
    ]);

    expect(summary.centeredTaps).toBe(1);
    expect(summary.missedTaps).toBe(1);
    expect(summary.rescueBeatIndexes).toEqual([1, 2]);
  });

  it('classifies the timing bias around a small center window', () => {
    expect(classifyBeatDelta(-70)).toBe('early');
    expect(classifyBeatDelta(0)).toBe('centered');
    expect(classifyBeatDelta(70)).toBe('late');
  });
});
