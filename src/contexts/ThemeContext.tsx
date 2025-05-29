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

// Explicitly define the ThemeProviderProps interface with proper type for children
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(defaultThemes[0]);
  const [installedThemes, setInstalledThemes] = React.useState<Theme[]>([...defaultThemes]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Load saved theme preference from localStorage
    const savedThemeId = localStorage?.getItem('currentThemeId');
    const savedThemes = localStorage?.getItem('installedThemes');

    if (savedThemeId) {
      // Explicitly type the theme parameter in the find callback
      const theme = installedThemes.find((t: Theme) => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
        applyThemeToDOM(theme);
      }
    }

    if (savedThemes) {
      try {
        const parsedThemes: Theme[] = JSON.parse(savedThemes);
        // Filter out any themes that might be duplicates of default themes
        const uniqueThemes = parsedThemes.filter(
          (theme: Theme) => !defaultThemes.some((dt: Theme) => dt.id === theme.id)
        );
        setInstalledThemes([...defaultThemes, ...uniqueThemes]);
      } catch (error) {
        console.error('Error loading saved themes:', error);
        // Reset to default themes if there's an error parsing saved themes
        setInstalledThemes([...defaultThemes]);
      }
    } else {
      // Initialize with default themes if no saved themes
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
    // Don't allow removing default themes
    if (defaultThemes.some((t: Theme) => t.id === themeId)) return;

    const newThemes = installedThemes.filter((t: Theme) => t.id !== themeId);
    setInstalledThemes(newThemes);
    // Only save non-default themes to localStorage
    localStorage.setItem('installedThemes', JSON.stringify(newThemes.filter((t: Theme) => !defaultThemes.some((dt: Theme) => dt.id === t.id))));

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
