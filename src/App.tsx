import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

// Lazy load pages for code splitting
const Welcome = lazy(() => import('@/pages/Welcome').then((m) => ({ default: m.Welcome })));
const Quiz = lazy(() => import('@/pages/Quiz').then((m) => ({ default: m.Quiz })));
const Result = lazy(() => import('@/pages/Result').then((m) => ({ default: m.Result })));
const History = lazy(() => import('@/pages/History').then((m) => ({ default: m.History })));
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));

function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin border-4 border-[var(--border-color)] border-t-[var(--accent-blue)]" />
        <p className="font-display text-sm font-bold uppercase tracking-wide text-[var(--text-secondary)]">
          加载中
        </p>
      </div>
    </div>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, fontSize } = useAppStore((state) => state.settings);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
  }, [darkMode, fontSize]);

  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <Header />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </ThemeProvider>
    </HashRouter>
  );
}
