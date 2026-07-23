export interface AudioFrameSnapshot {
  rms: number;
  peak: number;
  clipping: boolean;
  timestampMs: number;
}

export interface LatencyObservation {
  expectedMs: number;
  detectedMs: number;
}

export interface CalibrationSummary {
  noiseRms: number;
  signalRms: number;
  signalToNoiseDb: number;
  clippingRate: number;
  latencyOffsetMs: number;
  confidence: number;
  status: 'ready' | 'needs-signal' | 'needs-more-practice' | 'unsupported';
  notes: string[];
  recommendedTempo: number;
}

const average = (values: number[]): number =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const median = (values: number[]): number => {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const summarizeFrames = (frames: AudioFrameSnapshot[]): { rms: number; peak: number; clippingRate: number } => {
  if (!frames.length) return { rms: 0, peak: 0, clippingRate: 0 };
  return {
    rms: average(frames.map((frame) => frame.rms)),
    peak: Math.max(...frames.map((frame) => frame.peak)),
    clippingRate: frames.filter((frame) => frame.clipping).length / frames.length,
  };
};

export const classifyTimingDelta = (deltaMs: number, toleranceMs = 45): 'early' | 'centered' | 'late' => {
  if (deltaMs < -toleranceMs) return 'early';
  if (deltaMs > toleranceMs) return 'late';
  return 'centered';
};

export const estimateLatencyOffsetMs = (observations: LatencyObservation[]): number =>
  Math.round(median(observations.map((observation) => observation.detectedMs - observation.expectedMs)));

export const buildCalibrationSummary = ({
  noiseFrames,
  signalFrames,
  latencyObservations,
}: {
  noiseFrames: AudioFrameSnapshot[];
  signalFrames: AudioFrameSnapshot[];
  latencyObservations: LatencyObservation[];
}): CalibrationSummary => {
  const noise = summarizeFrames(noiseFrames);
  const signal = summarizeFrames(signalFrames);
  const snrDb = noise.rms > 0 ? 20 * Math.log10(Math.max(signal.rms, 0.0001) / Math.max(noise.rms, 0.0001)) : 0;
  const clippingRate = signal.clippingRate;
  const latencyOffsetMs = latencyObservations.length ? estimateLatencyOffsetMs(latencyObservations) : 0;

  const roomScore = clamp(1 - noise.rms / 0.05, 0, 1);
  const signalScore = clamp((signal.rms - noise.rms) / 0.12, 0, 1);
  const clippingScore = clamp(1 - clippingRate * 4, 0, 1);
  const latencyScore = clamp(1 - Math.abs(latencyOffsetMs) / 240, 0, 1);
  const confidence = Math.round((roomScore * 0.26 + signalScore * 0.34 + clippingScore * 0.2 + latencyScore * 0.2) * 100);

  const notes = [
    noise.rms < 0.02 ? 'Room noise is low enough for a focused practice session.' : 'The room is a little busy; keep the mic closer to the instrument.',
    signal.rms > noise.rms * 2 ? 'Your violin signal is strong enough for live coaching.' : 'Play a little nearer to the mic or with a firmer bow start.',
    clippingRate < 0.05 ? 'No clipping was detected.' : 'A few peaks clipped, so lower the input level if possible.',
    latencyObservations.length ? `Timing offset of ${latencyOffsetMs} ms will be used for rhythm scoring.` : 'Latency will be treated as unknown until a timing check is completed.',
  ];

  const status: CalibrationSummary['status'] =
    signal.rms <= noise.rms * 1.4
      ? 'needs-signal'
      : confidence >= 70
        ? 'ready'
        : 'needs-more-practice';

  const recommendedTempo = confidence >= 85 ? 96 : confidence >= 70 ? 84 : confidence >= 50 ? 72 : 60;

  return {
    noiseRms: Number(noise.rms.toFixed(4)),
    signalRms: Number(signal.rms.toFixed(4)),
    signalToNoiseDb: Number(snrDb.toFixed(1)),
    clippingRate: Number(clippingRate.toFixed(3)),
    latencyOffsetMs,
    confidence,
    status,
    notes,
    recommendedTempo,
  };
};

export const createCalibrationFrame = (samples: Float32Array, timestampMs: number): AudioFrameSnapshot => {
  let rms = 0;
  let peak = 0;
  let clipped = false;

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    rms += sample * sample;
    peak = Math.max(peak, Math.abs(sample));
    if (Math.abs(sample) >= 0.98) clipped = true;
  }

  return {
    rms: Math.sqrt(rms / samples.length),
    peak,
    clipping: clipped,
    timestampMs,
  };
};
