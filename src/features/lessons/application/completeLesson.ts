import { useAppStore } from '../../../store/useAppStore';
import { useUserProfileStore } from '../../../store/useUserProfileStore';

/**
 * Records lesson completion in every local projection that currently consumes it.
 * Keeping this orchestration outside React makes it testable and gives us one seam
 * to replace when practice sessions become the canonical progress model.
 */
export function completeLesson(lessonId: string): void {
  useAppStore.getState().completeLesson(lessonId);
  useUserProfileStore.getState().addCompletedLesson(lessonId);
}
