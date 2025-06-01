'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme, isCustomTheme } from '@/config/themes';
import { installThemeFromFile } from '@/utils/themeUtils';

export const ThemePicker: React.FC = () => {
  const { currentTheme, installedThemes, setTheme, removeTheme, installTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
    setIsOpen(false);
  };

  // Close the menu when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const button = document.querySelector('[aria-label="Change theme"]');
      
      if (isOpen && button && !button.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    // Add both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        onTouchStart={(e) => {
          // Prevent ghost clicks on mobile
          e.preventDefault();
          toggleMenu(e);
        }}
        className={`fixed bottom-4 right-4 z-50 bg-primary text-text p-3 rounded-full shadow-lg transition-all duration-200 ${
          isOpen 
            ? 'scale-95 bg-opacity-90' 
            : 'hover:shadow-xl hover:-translate-y-1 active:scale-95'
        } touch-manipulation select-none`}
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="theme-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          pointerEvents="none"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            id="theme-menu"
            className="fixed bottom-20 right-4 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 z-50 animate-fade-in-up"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-menu-title"
          >
            <h3 id="theme-menu-title" className="font-['Anton'] text-xl text-primary dark:text-white mb-4 uppercase tracking-wide">Choose Theme</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    const theme = await installThemeFromFile(file);
                    installTheme(theme);
                    setError(null);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to install theme');
                  }
                  
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-satisfy"
              >
                Install New Theme
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {installedThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentTheme.id === theme.id
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'hover:bg-neutral/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary">{theme.name}</span>
                    {currentTheme.id === theme.id && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-accent/70 mt-1">{theme.description}</p>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(theme.colors).map(([key, value]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: value }}
                        title={key}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
