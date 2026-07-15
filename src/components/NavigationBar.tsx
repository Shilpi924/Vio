import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const primaryDestinations = [
  { path: '/lessons', label: '🎓 Lessons', emoji: '🎓' },
  { path: '/free-play', label: '🎸 Free Play', emoji: '🎸' },
  { path: '/curriculum', label: '🗺️ Path', emoji: '🗺️' },
  { path: '/tutorials', label: '📚 Tutorials', emoji: '📚' },
  { path: '/statistics', label: '📊 Progress', emoji: '📊' },
];

const toolDestinations = [
  { path: '/tuner', label: '🎻', emoji: '🎻' },
  { path: '/timer', label: '⏱️', emoji: '⏱️' },
  { path: '/metronome', label: '🎵', emoji: '🎵' },
  { path: '/slow-playback', label: '🐢', emoji: '🐢' },
  { path: '/note-game', label: '🎮', emoji: '🎮' },
  { path: '/achievements', label: '🏆', emoji: '🏆' },
  { path: '/challenges', label: '🎯', emoji: '🎯' },
  { path: '/reminders', label: '⏰', emoji: '⏰' },
  { path: '/parent-dashboard', label: '👨‍👩‍👧', emoji: '👨‍👩‍👧' },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/') return '🏠 Home Base';
  if (pathname.startsWith('/lessons')) return '🎓 Lesson Hub';
  if (pathname === '/tuner') return '🎻 Tuner Station';
  if (pathname === '/timer') return '⏱️ Timer Zone';
  if (pathname === '/metronome') return '🎵 Rhythm Lab';
  if (pathname === '/slow-playback') return '🐢 Slow Motion';
  if (pathname === '/note-game') return '🎮 Game Arena';
  if (pathname === '/achievements') return '🏆 Trophy Room';
  if (pathname === '/challenges') return '🎯 Challenge Quest';
  if (pathname === '/reminders') return '⏰ Reminder Central';
  if (pathname === '/parent-dashboard') return '👨‍👩‍👧 Parent Portal';

  return primaryDestinations.find(({ path }) => pathname.startsWith(path))?.label
    ?? (pathname === '/settings' ? '⚙️ Settings' : '🎻 Violin Mentor');
}

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-2xl sticky top-0 z-50 border-b-4 border-yellow-300">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Top Row - Logo and Back */}
        <div className="flex items-center gap-3 mb-2">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
              title="Go back"
            >
              <ArrowLeft className="w-7 h-7 text-white" />
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            title="Go to home"
          >
            <Home className="w-7 h-7 text-white" />
            <span className="font-bold text-xl text-white drop-shadow-lg">🎻 Violin Mentor</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </button>
          
          {/* Page Title with Animation */}
          <div className="ml-auto px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <span className="font-bold text-lg text-white drop-shadow-lg animate-bounce">
              {getPageTitle(location.pathname)}
            </span>
          </div>
        </div>

        {/* Bottom Row - Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Destinations */}
          {primaryDestinations.map(({ path, label, emoji }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-4 py-3 rounded-xl font-bold text-base transition-all hover:scale-110 active:scale-95 backdrop-blur-sm ${
                location.pathname.startsWith(path)
                  ? 'bg-white text-purple-600 shadow-lg border-4 border-yellow-400'
                  : 'bg-white/20 text-white hover:bg-white/30 border-4 border-transparent'
              }`}
            >
              <span className="text-xl mr-1">{emoji}</span>
              <span className="drop-shadow-md">{label}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="w-2 h-8 bg-white/30 rounded-full mx-1"></div>

          {/* Tool Destinations - Emoji Buttons */}
          {toolDestinations.map(({ path, label, emoji }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-12 h-12 rounded-xl text-2xl transition-all hover:scale-125 active:scale-90 backdrop-blur-sm ${
                location.pathname === path
                  ? 'bg-white text-purple-600 shadow-lg border-4 border-yellow-400'
                  : 'bg-white/20 text-white hover:bg-white/30 border-4 border-transparent'
              }`}
              title={label}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
