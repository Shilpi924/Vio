export interface IntonationTarget {
  note: string;
  frequency: number;
  string: 'D' | 'A';
  finger: 1 | 2 | 3;
  color: string;
}

export interface IntonationAttempt {
  note: string;
  cents: number;
  struggleFrames: number;
  passed: boolean;
}

export const FIRST_POSITION_ORBIT: IntonationTarget[] = [
  { note: 'E4', frequency: 329.63, string: 'D', finger: 1, color: '#f97316' },
  { note: 'F#4', frequency: 369.99, string: 'D', finger: 2, color: '#eab308' },
  { note: 'G4', frequency: 392, string: 'D', finger: 3, color: '#22c55e' },
  { note: 'B4', frequency: 493.88, string: 'A', finger: 1, color: '#f97316' },
  { note: 'C#5', frequency: 554.37, string: 'A', finger: 2, color: '#eab308' },
  { note: 'D5', frequency: 587.33, string: 'A', finger: 3, color: '#22c55e' },
];

export const centsFromTarget = (frequency: number, targetFrequency: number): number =>
  Math.round(1200 * Math.log2(frequency / targetFrequency));

export const coachPitch = (cents: number, target: IntonationTarget): string => {
  if (Math.abs(cents) <= 8) return 'Hold that center—keep the bow moving.';
  if (cents > 35) return `Much too high. Slide finger ${target.finger} toward the scroll.`;
  if (cents > 8) return `A little sharp. Ease finger ${target.finger} toward the scroll.`;
  if (cents < -35) return `Much too low. Slide finger ${target.finger} toward the bridge.`;
  return `A little flat. Reach finger ${target.finger} toward the bridge.`;
};

export const selectRescueNotes = (
  attempts: IntonationAttempt[],
  targets: IntonationTarget[] = FIRST_POSITION_ORBIT,
): IntonationTarget[] =>
  [...attempts]
    .sort((left, right) => {
      const leftScore = (left.passed ? 0 : 1000) + left.struggleFrames + Math.abs(left.cents);
      const rightScore = (right.passed ? 0 : 1000) + right.struggleFrames + Math.abs(right.cents);
      return rightScore - leftScore;
    })
    .slice(0, 2)
    .map((attempt) => targets.find((target) => target.note === attempt.note))
    .filter((target): target is IntonationTarget => Boolean(target));
