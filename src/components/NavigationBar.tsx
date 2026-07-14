import { ArrowLeft, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const primaryDestinations = [
  { path: '/lessons', label: 'Lessons' },
  { path: '/free-play', label: 'Free Play' },
  { path: '/curriculum', label: 'Learning Path' },
  { path: '/tutorials', label: 'Tutorials' },
  { path: '/statistics', label: 'Progress' },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/lessons')) return 'Lessons';

  return primaryDestinations.find(({ path }) => pathname.startsWith(path))?.label
    ?? (pathname === '/settings' ? 'Settings' : 'Violin Mentor');
}

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname !== '/';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-auto">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go to home"
          >
            <Home className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-gray-900">Violin Mentor</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
          {primaryDestinations.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname.startsWith(path)
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600 min-w-24 text-right">{getPageTitle(location.pathname)}</div>
      </div>
    </nav>
  );
}
