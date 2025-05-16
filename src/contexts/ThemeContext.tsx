import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, defaultThemes } from '@/config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  installedThemes: Theme[];
  setTheme: (theme: Theme) => void;
  installTheme: (theme: Theme) => void;
  removeTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [installedThemes, setInstalledThemes] = useState<Theme[]>(defaultThemes);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Load saved theme preference from localStorage
    const savedThemeId = localStorage.getItem('currentThemeId');
    const savedThemes = localStorage.getItem('installedThemes');

    if (savedThemeId) {
      const theme = installedThemes.find(t => t.id === savedThemeId);
      if (theme) setCurrentTheme(theme);
    }

    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        setInstalledThemes([...defaultThemes, ...parsedThemes]);
      } catch (error) {
        console.error('Error loading saved themes:', error);
      }
    }
  }, []);

  const applyThemeToDOM = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('currentThemeId', theme.id);
    applyThemeToDOM(theme);
  };

  const installTheme = (theme: Theme) => {
    if (!installedThemes.some(t => t.id === theme.id)) {
      const newThemes = [...installedThemes, theme];
      setInstalledThemes(newThemes);
      localStorage.setItem('installedThemes', JSON.stringify(newThemes));
    }
  };

  const removeTheme = (themeId: string) => {
    // Don't allow removing default themes
    if (defaultThemes.some(t => t.id === themeId)) return;

    const newThemes = installedThemes.filter(t => t.id !== themeId);
    setInstalledThemes(newThemes);
    localStorage.setItem('installedThemes', JSON.stringify(newThemes));

    // If current theme is removed, switch to default
    if (currentTheme.id === themeId) {
      setTheme(defaultThemes[0]);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      installedThemes,
      setTheme,
      installTheme,
      removeTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
