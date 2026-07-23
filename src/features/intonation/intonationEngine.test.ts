import { describe, expect, it } from 'vitest';
import { centsFromTarget, coachPitch, FIRST_POSITION_ORBIT, selectRescueNotes } from './intonationEngine';

describe('intonation coaching engine', () => {
  it('measures pitch distance in cents', () => {
    expect(centsFromTarget(440, 440)).toBe(0);
    expect(centsFromTarget(466.16, 440)).toBeCloseTo(100, 0);
  });

  it('gives violin-specific directional guidance', () => {
    const target = FIRST_POSITION_ORBIT[0];
    expect(coachPitch(20, target)).toContain('scroll');
    expect(coachPitch(-20, target)).toContain('bridge');
  });

  it('builds a rescue loop from the two most difficult notes', () => {
    const rescue = selectRescueNotes([
      { note: 'E4', cents: 3, struggleFrames: 2, passed: true },
      { note: 'F#4', cents: -10, struggleFrames: 30, passed: true },
      { note: 'G4', cents: 0, struggleFrames: 3, passed: false },
    ]);

    expect(rescue.map((target) => target.note)).toEqual(['G4', 'F#4']);
  });
});
