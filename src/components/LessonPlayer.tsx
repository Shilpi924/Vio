import { Lesson } from '../types';

interface LessonPlayerProps {
  lesson: Lesson;
  onExit: () => void;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onExit, onComplete }: LessonPlayerProps) {
  return (
    <div className="lesson-player">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <button onClick={onExit} className="btn-secondary">Exit</button>
      </div>
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <p className="text-gray-700">Lesson content will be displayed here.</p>
        <p className="text-sm text-gray-500 mt-2">Tempo: {lesson.tempo} BPM</p>
        <p className="text-sm text-gray-500">Difficulty: {lesson.difficulty}</p>
        <button onClick={onComplete} className="btn-primary mt-4">Complete Lesson</button>
      </div>
    </div>
  );
}
