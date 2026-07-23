import { describe, expect, it } from 'vitest';
import { buildCalibrationSummary, classifyTimingDelta, estimateLatencyOffsetMs, summarizeFrames, type AudioFrameSnapshot } from './audioCalibration';

const frame = (rms: number, peak = rms, clipping = false): AudioFrameSnapshot => ({
  rms,
  peak,
  clipping,
  timestampMs: Date.now(),
});

describe('audio calibration helpers', () => {
  it('summarizes the room and signal frames into one reading', () => {
    const summary = summarizeFrames([frame(0.01), frame(0.02), frame(0.03, 0.04, true)]);
    expect(summary.rms).toBeCloseTo(0.02, 3);
    expect(summary.peak).toBeCloseTo(0.04, 3);
    expect(summary.clippingRate).toBeCloseTo(1 / 3, 3);
  });

  it('estimates latency from the middle of observed offsets', () => {
    expect(estimateLatencyOffsetMs([
      { expectedMs: 0, detectedMs: 120 },
      { expectedMs: 500, detectedMs: 620 },
      { expectedMs: 1000, detectedMs: 1110 },
    ])).toBe(120);
  });

  it('classifies timing bias with a small centered window', () => {
    expect(classifyTimingDelta(-60)).toBe('early');
    expect(classifyTimingDelta(12)).toBe('centered');
    expect(classifyTimingDelta(70)).toBe('late');
  });

  it('builds a calibration summary with a useful confidence score', () => {
    const summary = buildCalibrationSummary({
      noiseFrames: [frame(0.01), frame(0.015)],
      signalFrames: [frame(0.09), frame(0.08), frame(0.1)],
      latencyObservations: [
        { expectedMs: 0, detectedMs: 110 },
        { expectedMs: 500, detectedMs: 615 },
        { expectedMs: 1000, detectedMs: 1120 },
      ],
    });

    expect(summary.status).toBe('ready');
    expect(summary.confidence).toBeGreaterThan(50);
    expect(summary.recommendedTempo).toBeGreaterThanOrEqual(60);
    expect(summary.notes).toHaveLength(4);
  });
});
