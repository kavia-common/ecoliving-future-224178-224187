import React from 'react';

const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });

/**
 * PUBLIC_INTERFACE
 * useTheme hook to access theme state.
 */
export function useTheme() {
  return React.useContext(ThemeContext);
}

/**
 * PUBLIC_INTERFACE
 * ThemeProvider that syncs theme to document dataset and prefers-color-scheme.
 */
export function ThemeProvider({ children }) {
  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = React.useState(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    return stored || (prefersDark ? 'dark' : 'light');
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
