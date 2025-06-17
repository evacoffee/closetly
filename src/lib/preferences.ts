import * as React from 'react';

export interface UserPreferences {
  weatherAware: boolean;
  seasonalSuggestions: boolean;
  occasionBased: boolean;
  colorMatching: boolean;
  favoritesFirst: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  weatherAware: true,
  seasonalSuggestions: true,
  occasionBased: false,
  colorMatching: true,
  favoritesFirst: false,
};

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  
  try {
    const saved = localStorage.getItem('userPreferences');
    return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const currentPrefs = getPreferences();
    const newPrefs = { ...currentPrefs, ...prefs };
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
}

export function usePreferences() {
  const [preferences, setPreferences] = React.useState<UserPreferences>(getPreferences);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userPreferences') {
        setPreferences(getPreferences());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    savePreferences(updated);
    setPreferences(updated);
  };

  return {
    preferences,
    updatePreferences,
    ...preferences // Spread for direct property access
  };
}
