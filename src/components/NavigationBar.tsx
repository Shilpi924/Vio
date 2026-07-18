import { Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function getPageTitle(pathname: string): string {
  if (pathname === '/') return '� Violin Kids';
  if (pathname === '/beginner-path') return '� Learn Violin';
  if (pathname === '/free-play') return '🎵 Free Play';
  if (pathname.startsWith('/lessons')) return '🎶 Songs';
  return '� Violin Kids';
}

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Back Button */}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-2xl"
            title="Go back"
          >
            ←
          </button>
        )}

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Home"
        >
          <Home className="w-6 h-6 text-purple-600" />
        </button>

        {/* Page Title */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-800">{getPageTitle(location.pathname)}</h1>
        </div>
      </div>
    </nav>
  );
}
