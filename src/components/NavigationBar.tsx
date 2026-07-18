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
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-2xl flex items-center"
              title="Go back"
            >
              ← <span className="text-sm ml-1 hidden md:inline">Back</span>
            </button>
          )}

          {/* App Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Home"
          >
            <span className="text-2xl">🎻</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
              Violin Mentor
            </span>
          </button>
        </div>

        {/* Page Title */}
        <div className="flex-1 text-center pr-12 sm:pr-32">
          <h1 className="text-lg font-semibold text-gray-700">{getPageTitle(location.pathname)}</h1>
        </div>
      </div>
    </nav>
  );
}
