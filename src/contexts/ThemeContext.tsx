'use client';

import * as React from 'react';
import { Theme, defaultThemes } from '@/config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  installedThemes: Theme[];
  setTheme: (theme: Theme) => void;
  installTheme: (theme: Theme) => void;
  removeTheme: (themeId: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(defaultThemes[0]);
  const [installedThemes, setInstalledThemes] = React.useState<Theme[]>([...defaultThemes]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedThemeId = localStorage?.getItem('currentThemeId');
    const savedThemes = localStorage?.getItem('installedThemes');

    if (savedThemeId) {
      const theme = installedThemes.find((t: Theme) => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyThemeToDOM(theme);
      }
    }

    if (savedThemes) {
      try {
        const parsedThemes: Theme[] = JSON.parse(savedThemes);
        const uniqueThemes = parsedThemes.filter(
          (theme: Theme) => !defaultThemes.some((dt: Theme) => dt.id === theme.id)
        );
        setInstalledThemes([...defaultThemes, ...uniqueThemes]);
      } catch (error) {
        console.error('Error loading saved themes:', error);
        setInstalledThemes([...defaultThemes]);
      }
    } else {
      setInstalledThemes([...defaultThemes]);
    }
  }, []);

  const applyThemeToDOM = (theme: Theme) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]: [string, string]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const setTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('currentThemeId', newTheme.id);
    applyThemeToDOM(newTheme);
  };

  const installTheme = (newTheme: Theme) => {
    if (!installedThemes.some((t: Theme) => t.id === newTheme.id)) {
      const newThemes = [...installedThemes, newTheme];
      setInstalledThemes(newThemes);
      localStorage.setItem('installedThemes', JSON.stringify(newThemes.filter((t: Theme) => !defaultThemes.some((dt: Theme) => dt.id === t.id))));
    }
  };

  const removeTheme = (themeId: string) => {
    if (defaultThemes.some((t: Theme) => t.id === themeId)) return;

    const newThemes = installedThemes.filter((t: Theme) => t.id !== themeId);
    setInstalledThemes(newThemes);
    localStorage.setItem('installedThemes', JSON.stringify(newThemes.filter((t: Theme) => !defaultThemes.some((dt: Theme) => dt.id === t.id))));

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
