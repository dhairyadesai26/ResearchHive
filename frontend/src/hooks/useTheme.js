import { useState, useEffect, useCallback } from 'react';

/**
 * Theme hook with localStorage persistence.
 * Applies data-theme="light" or data-theme="dark" to <html>.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('researchhive-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to dark
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('researchhive-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
