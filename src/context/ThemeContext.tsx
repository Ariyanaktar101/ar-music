
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ar-music-theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const { accentColor } = useSettings();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY) as Theme | null;
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    } catch (error) {
        console.error("Failed to parse theme from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    root.style.setProperty('--primary', accentColor);

  }, [theme, accentColor, isLoaded]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  };
  
  if (!isLoaded) {
      return null;
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
