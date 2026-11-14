'use client';

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('astrotrack_theme') as 'light' | 'dark' | null;
        if (saved === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          return 'dark';
        }
      } catch {
        // ignore
      }
    }
    return 'light';
  });

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('astrotrack_theme', 'dark'); } catch {}
    } else {
      setTheme('light');
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('astrotrack_theme', 'light'); } catch {}
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl text-muted hover:text-main hover:bg-surface-alt transition-colors cursor-pointer border border-border"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} cockpit mode`}
      aria-label="Toggle theme mode"
    >
      {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-[#176B68]" />}
    </button>
  );
}
