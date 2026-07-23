import { useAppStore } from '../../../store/useAppStore';
import { useUserProfileStore } from '../../../store/useUserProfileStore';

/**
 * Records lesson completion in every local projection that currently consumes it.
 * Keeping this orchestration outside React makes it testable and gives us one seam
 * to replace when practice sessions become the canonical progress model.
 */
interface CompletionResult {
  profileId: string;
  title: string;
  durationSeconds: number;
  notesPlayed: number;
  correctNotes: number;
  hardestNotes?: string[];
}

export function completeLesson(lessonId: string, result?: CompletionResult): void {
  useAppStore.getState().completeLesson(lessonId);
  useUserProfileStore.getState().addCompletedLesson(lessonId);
  if (result) {
    useAppStore.getState().recordPracticeSession({
      profileId: result.profileId,
      startedAt: new Date().toISOString(),
      durationSeconds: result.durationSeconds,
      activity: 'lesson',
      title: result.title,
      lessonId,
      notesPlayed: result.notesPlayed,
      correctNotes: result.correctNotes,
      accuracy: result.notesPlayed > 0
        ? Math.round((result.correctNotes / result.notesPlayed) * 100)
        : 0,
      hardestNotes: result.hardestNotes ?? [],
      completed: true,
    });
    useUserProfileStore.getState().addPracticeTime(Math.max(1, Math.round(result.durationSeconds / 60)));
    useUserProfileStore.getState().addExperience(100);
    useUserProfileStore.getState().updateStreak();
  }
}
