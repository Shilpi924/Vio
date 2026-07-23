import { BarChart3, BookOpen, Home, Menu, Music2, Settings, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', labelKey: 'nav.home', icon: Home },
  { path: '/beginner-path', labelKey: 'nav.learn', icon: Sparkles },
  { path: '/lessons', labelKey: 'nav.songs', icon: Music2 },
  { path: '/curriculum', labelKey: 'nav.path', icon: BookOpen },
  { path: '/statistics', labelKey: 'nav.progress', icon: BarChart3 },
  { path: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#fffdf8]/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4" aria-label="Primary navigation">
        <button
          type="button"
          onClick={() => go('/')}
          className="flex items-center gap-3 rounded-xl px-2 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
          aria-label="Violin Mentor home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-950 text-xl text-white" aria-hidden="true">🎻</span>
          <span>
            <span className="block text-lg font-black leading-none text-slate-950">Violin Mentor</span>
            <span className="mt-1 block text-xs font-semibold text-purple-700">Practice with purpose</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ path, labelKey, icon: Icon }) => {
            const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <button
                type="button"
                key={path}
                onClick={() => go(path)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                  active ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-stone-100 hover:text-slate-950'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {t(labelKey)}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-stone-200 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-stone-200 bg-[#fffdf8] px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
            {navItems.map(({ path, labelKey, icon: Icon }) => (
              <button
                type="button"
                key={path}
                onClick={() => go(path)}
                className="flex min-h-12 items-center gap-2 rounded-xl bg-stone-100 px-4 text-left font-bold text-slate-800"
              >
                <Icon size={18} aria-hidden="true" />
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
