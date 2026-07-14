import { sampleLessons } from '../data/lessons';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../types';

export default function LessonLibraryPage() {
  const navigate = useNavigate();
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Lesson Library</h1>
        <p className="text-lg text-gray-700 mb-6">Browse and select lessons to practice</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleLessons.map((lesson) => {
            const isCompleted = userProfile?.completedLessons.includes(lesson.id);
            
            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105 relative"
              >
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                  <span className="text-gray-500 text-sm">{lesson.tempo} BPM</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                <p className="text-gray-600 mb-3">{lesson.category}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>🎵 {lesson.notes.length} notes</span>
                  <span>⏱️ {Math.round(lesson.notes.length * 60 / lesson.tempo)}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
