import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { History, Home, Settings, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/', label: '首页', icon: Home },
  { to: '/history', label: '历史', icon: History },
  { to: '/settings', label: '设置', icon: Settings },
];

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--border-color)] bg-[var(--bg-primary)]">
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent-blue)] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          ::self
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors sm:px-4 sm:text-sm ${
                  active
                    ? 'bg-[var(--bg-alt)] text-[var(--text-inverse)]'
                    : 'hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon size={16} className="sm:size-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center border-2 border-[var(--border-color)] sm:hidden"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 border-b-[3px] border-[var(--border-color)] bg-[var(--bg-primary)] sm:hidden">
          <nav className="flex flex-col p-2">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                    active
                      ? 'bg-[var(--bg-alt)] text-[var(--text-inverse)]'
                      : 'hover:bg-[var(--bg-card)]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
