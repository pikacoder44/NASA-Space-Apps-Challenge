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
    // Always ensure light is the default on first load
    document.documentElement.removeAttribute('data-theme');
    return 'light';
  });

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('astrotrack_theme', 'dark'); } catch { /* ignore */ }
    } else {
      setTheme('light');
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('astrotrack_theme', 'light'); } catch { /* ignore */ }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-colors cursor-pointer border border-[#D9E2DE] hover:bg-[#EAF0ED] text-[#60716E] hover:text-[#172A2B]"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme mode"
    >
      {theme === 'dark'
        ? <Sun size={16} className="text-amber-400" />
        : <Moon size={16} className="text-[#176B68]" />
      }
    </button>
  );
}
