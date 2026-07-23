import { describe, expect, it } from 'vitest';
import { calculateLevelProgress, curriculum, isLevelComplete, isLevelUnlocked } from './curriculum';
import { sampleLessons } from './lessons';

describe('curriculum integrity', () => {
  it('only references lessons that are available in the cleared catalog', () => {
    const lessonIds = new Set(sampleLessons.map((lesson) => lesson.id));
    expect(curriculum.flatMap((level) => level.lessons).every((id) => lessonIds.has(id))).toBe(true);
  });

  it('unlocks levels only when prerequisites are complete', () => {
    expect(isLevelUnlocked('level-2', [])).toBe(false);
    expect(isLevelUnlocked('level-2', ['level-1'])).toBe(true);
  });

  it('calculates progress from completed lessons', () => {
    const first = curriculum[0];
    expect(calculateLevelProgress(first.id, [first.lessons[0]])).toBeCloseTo(100 / 3);
    expect(isLevelComplete(first, first.lessons)).toBe(true);
  });
});
