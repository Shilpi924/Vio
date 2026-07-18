import { motion } from 'framer-motion';
import { PlayCircle, Clock, Music } from 'lucide-react';
import type { Lesson } from '../../types';

interface SongCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
  onClick: () => void;
}

export function SongCard({ lesson, isCompleted, onClick }: SongCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-green-600 shadow-green-500/20';
      case 'intermediate': return 'from-yellow-400 to-yellow-600 shadow-yellow-500/20';
      case 'advanced': return 'from-red-400 to-red-600 shadow-red-500/20';
      default: return 'from-blue-400 to-blue-600 shadow-blue-500/20';
    }
  };

  // Fake image for demo purposes since we don't have real covers in our types
  const coverImage = `https://images.unsplash.com/photo-1460036521480-c1baf97087e5?auto=format&fit=crop&w=400&q=80`;

  const duration = Math.round((lesson.notes?.length || 50) * 60 / (lesson.tempo || 60));

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative h-[300px] w-[220px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow flex-shrink-0"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${coverImage})` }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 backdrop-blur-sm">
          ✓
        </div>
      )}

      {/* Difficulty Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r shadow-lg ${getDifficultyColor(lesson.difficulty)} backdrop-blur-md`}>
          {lesson.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 transition-transform group-hover:translate-y-0">
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{lesson.title}</h3>
        <p className="text-gray-300 text-sm mb-3 font-medium">{lesson.category}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
          <div className="flex items-center gap-1">
            <Music size={14} />
            <span>{lesson.notes?.length || '?'} notes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}s</span>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
        <PlayCircle size={64} className="text-white drop-shadow-lg" />
      </div>
    </motion.div>
  );
}
