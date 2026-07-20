import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const pitchService = vi.hoisted(() => ({
  callback: null as ((noteName: string) => void) | null,
  start: vi.fn(async (callback: (noteName: string) => void) => {
    pitchService.callback = callback;
  }),
  stop: vi.fn(),
}));

const cursor = vi.hoisted(() => {
  const pitches = ['C', 'D', 'E', 'F', 'G', 'A'];
  return {
    index: 0,
    pitches,
    iterator: { EndReached: false },
    NotesUnderCursor: vi.fn(() => [{
      Pitch: {
        fundamentalNote: [0, 2, 4, 5, 7, 9][cursor.index],
        octave: 1,
        ToStringShort: (offset = 0) => `${pitches[cursor.index]}${1 + offset}`,
      },
    }]),
    next: vi.fn(() => {
      cursor.index += 1;
      cursor.iterator.EndReached = cursor.index >= pitches.length;
    }),
    show: vi.fn(),
    hide: vi.fn(),
    reset: vi.fn(() => {
      cursor.index = 0;
      cursor.iterator.EndReached = false;
    }),
  };
});

vi.mock('../services/pitchDetectionService', () => ({ pitchDetectionService: pitchService }));
vi.mock('../services/audioService', () => ({
  audioService: { initialize: vi.fn(), playNote: vi.fn() },
}));
vi.mock('opensheetmusicdisplay', () => ({
  OpenSheetMusicDisplay: class {
    cursor = cursor;
    load = vi.fn(async () => undefined);
    render = vi.fn();
  },
}));

import { OSMDViewer, comparePitches, formatScorePitch, pitchesMatch } from './OSMDViewer';

describe('OSMDViewer microphone practice', () => {
  beforeEach(() => {
    pitchService.callback = null;
    pitchService.start.mockClear();
    pitchService.stop.mockClear();
    cursor.index = 0;
    cursor.iterator.EndReached = false;
    cursor.next.mockClear();
    cursor.reset.mockClear();
  });

  it('advances only when the expected pitch is detected and does not reset at completion', async () => {
    render(<OSMDViewer xmlStr="<score-partwise />" />);

    fireEvent.click(screen.getByRole('button', { name: 'Practice (Mic)' }));
    await waitFor(() => expect(screen.getByText('C4')).toBeTruthy());

    act(() => pitchService.callback?.('G4'));
    expect(cursor.next).not.toHaveBeenCalled();
    expect(screen.getByText('high')).toBeTruthy();

    act(() => pitchService.callback?.('C4'));
    await waitFor(() => expect(screen.getByText('D4')).toBeTruthy());
    act(() => pitchService.callback?.('D4'));
    await waitFor(() => expect(screen.getByText('E4')).toBeTruthy());
    act(() => pitchService.callback?.('E4'));
    await waitFor(() => expect(screen.getByText('F4')).toBeTruthy());

    expect(pitchService.stop).not.toHaveBeenCalled();
    expect(cursor.reset).not.toHaveBeenCalled();

    act(() => pitchService.callback?.('F4'));
    await waitFor(() => expect(screen.getByText('G4')).toBeTruthy());
    act(() => pitchService.callback?.('G4'));
    await waitFor(() => expect(screen.getByText('A4')).toBeTruthy());
    act(() => pitchService.callback?.('A4'));

    await waitFor(() => expect(pitchService.stop).toHaveBeenCalledTimes(1));
    expect(cursor.next).toHaveBeenCalledTimes(6);
    expect(cursor.reset).not.toHaveBeenCalled();
  });

  it('compares pitches by note and octave', () => {
    expect(pitchesMatch('C#4', 'C#4')).toBe(true);
    expect(pitchesMatch('A#4', 'Bb4')).toBe(true);
    expect(pitchesMatch('C4', 'C5')).toBe(false);
    expect(comparePitches('A4', 'G4')).toBe('low');
    expect(comparePitches('A4', 'B4')).toBe('high');
    expect(formatScorePitch({ ToStringShort: (offset: number) => `A${1 + offset}` })).toBe('A4');
  });
});
