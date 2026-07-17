import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useNavigate } from 'react-router-dom';
import KidFriendlyButton from '../components/KidFriendlyButton';
import GuidedTour, { useGuidedTour } from '../components/GuidedTour';
import GoogleSignIn from '../components/GoogleSignIn';
import DifficultyProgress from '../components/DifficultyProgress';

export default function HomePage() {
  const navigate = useNavigate();
  const statistics = useAppStore((state) => state.statistics);
  const getActiveProfile = useUserProfileStore((state) => state.getActiveProfile);
  const signInWithGoogle = useUserProfileStore((state) => state.signInWithGoogle);
  const signOut = useUserProfileStore((state) => state.signOut);
  const isAuthenticated = useUserProfileStore((state) => state.isAuthenticated);
  const googleUser = useUserProfileStore((state) => state.googleUser);
  const userProfile = getActiveProfile();
  const [showMore, setShowMore] = useState(false);
  const { showTour, startTour, endTour } = useGuidedTour();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Check if user has seen tour before using localStorage
  const hasSeenTour = localStorage.getItem('hasSeenTour') === 'true';

  // Auto-start tour only for first-time users
  useEffect(() => {
    if (!hasSeenTour) {
      setTimeout(() => {
        startTour();
        localStorage.setItem('hasSeenTour', 'true');
      }, 1000);
    }
  }, [hasSeenTour, startTour]);

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Simple, clear header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎻 Violin Mentor</h1>
          <p className="text-lg text-gray-600">Start your violin journey</p>
          
          {/* Google Sign In / User Info */}
          <div className="mt-4">
            {isAuthenticated && googleUser ? (
              <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-3 shadow-md">
                {googleUser.picture && (
                  <img 
                    src={googleUser.picture} 
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{googleUser.name}</p>
                  <p className="text-sm text-gray-600">{googleUser.email}</p>
                </div>
                <button
                  onClick={signOut}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <GoogleSignIn onSignIn={signInWithGoogle} />
            )}
          </div>
        </div>

        {/* Progress summary - minimal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div id="tour-progress" className="bg-white rounded-2xl shadow-lg p-6">
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
          
          <DifficultyProgress showUnlockedFeatures={false} />
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
