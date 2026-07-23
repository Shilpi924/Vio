export type RhythmPulseSlot = 'tap' | 'rest';

export interface RhythmPulsePattern {
  id: string;
  name: string;
  description: string;
  slots: RhythmPulseSlot[];
  recommendedTempo: number;
}

export interface RhythmPulseExpectedBeat {
  beatIndex: number;
  expectedMs: number;
}

export interface RhythmPulseBeatMatch {
  beatIndex: number;
  expectedMs: number;
  detectedMs?: number;
  deltaMs?: number;
  quality: 'early' | 'centered' | 'late' | 'missed';
}

export interface RhythmPulseSummary {
  beatMatches: RhythmPulseBeatMatch[];
  totalTaps: number;
  centeredTaps: number;
  missedTaps: number;
  averageDeltaMs: number;
  timingSpreadMs: number;
  score: number;
  rescueBeatIndexes: number[];
}

export const RHYTHM_PULSE_PATTERNS: RhythmPulsePattern[] = [
  {
    id: 'steady-steps',
    name: 'Steady Steps',
    description: 'Every beat lands in the lane. Perfect for a first timing read.',
    slots: ['tap', 'tap', 'tap', 'tap', 'tap', 'tap', 'tap', 'tap'],
    recommendedTempo: 72,
  },
  {
    id: 'skip-the-middle',
    name: 'Skip the Middle',
    description: 'Two quiet beats force you to hold the pulse inside the hand.',
    slots: ['tap', 'tap', 'rest', 'tap', 'tap', 'rest', 'tap', 'tap'],
    recommendedTempo: 60,
  },
  {
    id: 'off-beat-reach',
    name: 'Off-beat Reach',
    description: 'A slightly more playful grid with alternating rests and attacks.',
    slots: ['tap', 'rest', 'tap', 'tap', 'rest', 'tap', 'tap', 'rest'],
    recommendedTempo: 84,
  },
];

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const classifyBeatDelta = (deltaMs: number, toleranceMs = 45): 'early' | 'centered' | 'late' =>
  deltaMs < -toleranceMs ? 'early' : deltaMs > toleranceMs ? 'late' : 'centered';

export const buildExpectedBeats = (
  pattern: RhythmPulsePattern,
  bpm: number,
  startAtMs: number,
  latencyOffsetMs = 0,
): RhythmPulseExpectedBeat[] => {
  const beatDurationMs = 60000 / bpm;
  return pattern.slots.flatMap((slot, beatIndex) => (
    slot === 'tap'
      ? [{ beatIndex, expectedMs: startAtMs + (beatIndex * beatDurationMs) + latencyOffsetMs }]
      : []
  ));
};

export const matchDetectedOnsets = (
  expectedBeats: RhythmPulseExpectedBeat[],
  detectedOnsets: number[],
  toleranceMs = 140,
): RhythmPulseBeatMatch[] => {
  const matches: RhythmPulseBeatMatch[] = [];
  let onsetIndex = 0;

  for (const beat of expectedBeats) {
    while (onsetIndex < detectedOnsets.length && detectedOnsets[onsetIndex] < beat.expectedMs - toleranceMs) {
      onsetIndex += 1;
    }

    const detectedMs = detectedOnsets[onsetIndex];
    if (typeof detectedMs !== 'number' || Math.abs(detectedMs - beat.expectedMs) > toleranceMs) {
      matches.push({
        beatIndex: beat.beatIndex,
        expectedMs: beat.expectedMs,
        quality: 'missed',
      });
      continue;
    }

    const deltaMs = Math.round(detectedMs - beat.expectedMs);
    matches.push({
      beatIndex: beat.beatIndex,
      expectedMs: beat.expectedMs,
      detectedMs,
      deltaMs,
      quality: classifyBeatDelta(deltaMs),
    });
    onsetIndex += 1;
  }

  return matches;
};

export const summarizePulse = (beatMatches: RhythmPulseBeatMatch[]): RhythmPulseSummary => {
  const taps = beatMatches.length;
  const centeredTaps = beatMatches.filter((match) => match.quality === 'centered').length;
  const missedTaps = beatMatches.filter((match) => match.quality === 'missed').length;
  const deltas = beatMatches
    .map((match) => match.deltaMs)
    .filter((delta): delta is number => typeof delta === 'number');
  const averageDeltaMs = Math.round(
    deltas.reduce((sum, delta) => sum + delta, 0) / Math.max(1, deltas.length),
  );
  const timingSpreadMs = deltas.length
    ? Math.round(Math.max(...deltas) - Math.min(...deltas))
    : 0;
  const centeredScore = Math.round((centeredTaps / Math.max(1, taps)) * 100);
  const resilienceBonus = clamp(Math.round(100 - timingSpreadMs / 2), 0, 100);
  const score = Math.round((centeredScore * 0.7) + (resilienceBonus * 0.3));

  const rescueBeatIndexes = [...beatMatches]
    .sort((left, right) => {
      const leftPenalty = left.quality === 'centered' ? 0 : left.quality === 'missed' ? 1000 : Math.abs(left.deltaMs ?? 0);
      const rightPenalty = right.quality === 'centered' ? 0 : right.quality === 'missed' ? 1000 : Math.abs(right.deltaMs ?? 0);
      return rightPenalty - leftPenalty;
    })
    .filter((match) => match.quality !== 'centered')
    .slice(0, 3)
    .map((match) => match.beatIndex);

  return {
    beatMatches,
    totalTaps: taps,
    centeredTaps,
    missedTaps,
    averageDeltaMs,
    timingSpreadMs,
    score,
    rescueBeatIndexes,
  };
};
