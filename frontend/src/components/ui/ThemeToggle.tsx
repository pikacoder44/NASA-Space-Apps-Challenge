'use client';

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('astrotrack_theme') as 'dark' | 'light' | null;
      if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        return 'light';
      }
    }
    return 'dark';
  });

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('astrotrack_theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('astrotrack_theme', 'dark');
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
      {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-teal-600" />}
    </button>
  );
}
