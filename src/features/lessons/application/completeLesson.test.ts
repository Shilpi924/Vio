import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '../../../store/useAppStore';
import { useUserProfileStore } from '../../../store/useUserProfileStore';
import { completeLesson } from './completeLesson';

describe('completeLesson', () => {
  beforeEach(() => {
    useAppStore.setState((state) => ({
      statistics: { ...state.statistics, songsCompleted: [] },
    }));
    useUserProfileStore.setState((state) => {
      const activeProfile = state.profiles[state.activeProfileId];
      return {
        profiles: {
          ...state.profiles,
          [state.activeProfileId]: { ...activeProfile, completedLessons: [] },
        },
      };
    });
  });

  it('updates both progress projections without duplicating completion', () => {
    completeLesson('first-lesson');
    completeLesson('first-lesson');

    expect(useAppStore.getState().statistics.songsCompleted).toEqual(['first-lesson']);
    expect(useUserProfileStore.getState().getActiveProfile()?.completedLessons).toEqual(['first-lesson']);
  });
});
