import { ArrowLeft, Home, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/lessons')) return 'Songs';
  if (pathname === '/tuner') return 'Tuner';
  if (pathname === '/timer') return 'Timer';
  if (pathname === '/metronome') return 'Beat Keeper';
  if (pathname === '/slow-playback') return 'Slow Play';
  if (pathname === '/note-game') return 'Note Game';
  if (pathname === '/achievements') return 'Awards';
  if (pathname === '/challenges') return 'Challenges';
  if (pathname === '/reminders') return 'Reminders';
  if (pathname === '/parent-dashboard') return 'Parents';
  if (pathname === '/curriculum') return 'Learn';
  if (pathname === '/free-play') return 'Practice';
  if (pathname === '/tutorials') return 'Tutorials';
  if (pathname === '/statistics') return 'Progress';
  if (pathname === '/settings') return 'Settings';
  return 'Violin Mentor';
}

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Back Button */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Home"
        >
          <Home className="w-5 h-5 text-purple-600" />
        </button>

        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">{getPageTitle(location.pathname)}</h1>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </nav>
  );
}
