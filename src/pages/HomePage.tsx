import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useNavigate } from 'react-router-dom';
import KidFriendlyButton from '../components/KidFriendlyButton';
import GuidedTour, { useGuidedTour } from '../components/GuidedTour';

export default function HomePage() {
  const navigate = useNavigate();
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const userProfile = getActiveProfile();
  const [showMore, setShowMore] = useState(false);
  const { showTour, startTour, endTour } = useGuidedTour();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Auto-start tour for new users (no completed lessons)
  useState(() => {
    if (!userProfile || userProfile.completedLessons.length === 0) {
      setTimeout(() => startTour(), 1000);
    }
  });

  // Simplified to 3 main actions - human-centered design
  const mainActions = [
    { path: '/beginner-path', title: 'Learn', icon: '📚', subtitle: 'Step-by-step lessons', color: 'from-blue-500 to-indigo-600' },
    { path: '/free-play', title: 'Practice', icon: '🎻', subtitle: 'Free practice mode', color: 'from-purple-500 to-pink-600' },
    { path: '/lessons', title: 'Play', icon: '🎵', subtitle: 'Learn songs', color: 'from-green-500 to-emerald-600' },
  ];

  // Quick tools - consolidated and simplified
  const quickTools = [
    { path: '/tuner', title: 'Tuner', icon: '🎻' },
    { path: '/metronome', title: 'Beat', icon: '🎵' },
    { path: '/timer', title: 'Timer', icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Simple, clear header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎻 Violin Mentor</h1>
          <p className="text-lg text-gray-600">Start your violin journey</p>
        </div>

        {/* Progress summary - minimal */}
        <div id="tour-progress" className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{formatTime(statistics.totalPracticeTime)}</div>
              <div className="text-sm text-gray-500">Practice</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div>
              <div className="text-3xl font-bold text-green-600">{statistics.streak}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{statistics.accuracy.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>

        {/* 3 Main Actions - clear and obvious */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mainActions.map((action) => (
            <button
              key={action.path}
              id={`tour-${action.title.toLowerCase()}`}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
            >
              <div className="text-4xl mb-3">{action.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{action.title}</div>
              <div className="text-gray-500">{action.subtitle}</div>
            </button>
          ))}
        </div>

        {/* Quick Tools - consolidated */}
        <div id="tour-tools" className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Tools</h2>
          <div className="flex gap-4">
            {quickTools.map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex-1 bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-all text-center"
              >
                <div className="text-3xl mb-1">{tool.icon}</div>
                <div className="text-sm font-medium text-gray-700">{tool.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Progressive disclosure for more tools */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="text-xl font-bold text-gray-900">More Tools</span>
            <span className="text-2xl">{showMore ? '▼' : '▶'}</span>
          </button>
          
          {showMore && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => navigate('/fingerboard')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🎻</div>
                <div className="text-sm text-gray-700">Finger Guide</div>
              </button>
              <button onClick={() => navigate('/video-tutorials')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🎬</div>
                <div className="text-sm text-gray-700">Video Lessons</div>
              </button>
              <button onClick={() => navigate('/audio-compare')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🎵</div>
                <div className="text-sm text-gray-700">Sound Compare</div>
              </button>
              <button onClick={() => navigate('/slow-playback')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🐢</div>
                <div className="text-sm text-gray-700">Slow Down</div>
              </button>
              <button onClick={() => navigate('/note-game')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🎮</div>
                <div className="text-sm text-gray-700">Fun Games</div>
              </button>
              <button onClick={() => navigate('/achievements')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm text-gray-700">Awards</div>
              </button>
              <button onClick={() => navigate('/challenges')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm text-gray-700">Challenges</div>
              </button>
              <button onClick={() => navigate('/reminders')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">⏰</div>
                <div className="text-sm text-gray-700">Reminders</div>
              </button>
              <button onClick={() => navigate('/parent-dashboard')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">👨‍👩‍👧</div>
                <div className="text-sm text-gray-700">Parents</div>
              </button>
              <button onClick={() => navigate('/tutorials')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">📖</div>
                <div className="text-sm text-gray-700">How-To</div>
              </button>
              <button onClick={() => navigate('/statistics')} className="bg-gray-100 rounded-xl p-3 hover:bg-gray-200">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm text-gray-700">Your Progress</div>
              </button>
            </div>
          )}
        </div>

        {/* Continue Learning - simplified */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          {!userProfile || userProfile.completedLessons.length === 0 ? (
            <div className="text-center">
              <p className="text-xl mb-4">Ready to start learning?</p>
              <button
                onClick={() => navigate('/beginner-path')}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors"
              >
                Start Beginner Path →
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold mb-1">Keep going!</p>
                <p className="text-purple-100">{userProfile.completedLessons.length} lessons completed</p>
              </div>
              <button
                onClick={() => navigate('/beginner-path')}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors"
              >
                Continue →
              </button>
            </div>
          )}
        </div>

        {/* Guided Tour */}
        <GuidedTour
          show={showTour}
          onComplete={endTour}
          onSkip={endTour}
        />
      </div>
    </div>
  );
}
