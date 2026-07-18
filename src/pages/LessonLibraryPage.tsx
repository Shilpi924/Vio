import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sampleLessons } from '../data/lessons';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { SongCard } from '../components/Library/SongCard';
import type { Lesson } from '../types';

export default function LessonLibraryPage() {
  const navigate = useNavigate();
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  const categories = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredLessons = sampleLessons.filter(lesson => {
    const matchesFilter = activeFilter === 'all' || lesson.difficulty === activeFilter;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group lessons by category for Netflix-style rows
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const featuredLesson = sampleLessons[0]; // Just picking the first one as featured

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558556133-7227d81a3014?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        
        <div className="relative z-10 px-8 md:px-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold tracking-wider mb-4 inline-block">
              PIECE OF THE WEEK
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {featuredLesson.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              Master this beautiful piece categorized under {featuredLesson.category}. 
              Perfect for {featuredLesson.difficulty} players looking to improve their technique.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleLessonClick(featuredLesson)}
                className="flex items-center gap-2 bg-white text-gray-950 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                <Play size={20} className="fill-current" /> Play Now
              </button>
              <button 
                onClick={() => navigate('/import')}
                className="flex items-center gap-2 bg-gray-500/30 backdrop-blur-md border border-gray-500/50 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-500/50 transition-colors"
              >
                <Upload size={20} /> Import MusicXML
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-8 md:px-16 py-8 relative z-20 -mt-10">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap capitalize
                  ${activeFilter === category 
                    ? 'bg-white text-gray-900 shadow-lg scale-105' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white backdrop-blur-md border border-gray-700/50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search pieces, composers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Netflix Style Rows */}
        <div className="space-y-12 pb-24">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedLessons).map(([category, lessons]) => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-white/90 flex items-center gap-2">
                  {category} 
                  <span className="text-sm font-normal text-gray-500">({lessons.length})</span>
                </h2>
                
                <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x scrollbar-hide">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="snap-start">
                      <SongCard
                        lesson={lesson}
                        isCompleted={userProfile?.completedLessons.includes(lesson.id)}
                        onClick={() => handleLessonClick(lesson)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            
            {Object.keys(groupedLessons).length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20"
              >
                <Filter size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400">No pieces found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global styles for hiding scrollbar but allowing scroll */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
