import { Theme } from '@/config/themes';

export interface ThemeFile {
  theme: Theme;
  version: string;
  compatibility: string[];
}

export const validateTheme = (themeData: any): themeData is ThemeFile => {
  if (!themeData || typeof themeData !== 'object') return false;
  if (!themeData.theme || !themeData.version || !Array.isArray(themeData.compatibility)) return false;

  const theme = themeData.theme;
  const requiredColors = ['primary', 'secondary', 'background', 'text', 'accent', 'neutral'];
  
  return (
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.description === 'string' &&
    typeof theme.author === 'string' &&
    typeof theme.colors === 'object' &&
    requiredColors.every(color => typeof theme.colors[color] === 'string' && 
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(theme.colors[color]))
  );
};

export const installThemeFromFile = async (file: File): Promise<Theme> => {
  try {
    const content = await file.text();
    const themeData = JSON.parse(content);

    if (!validateTheme(themeData)) {
      throw new Error('Invalid theme file format');
    }

    return {
      ...themeData.theme,
      installDate: new Date()
    };
  } catch (error) {
    throw new Error('Failed to parse theme file');
  }
};

export const generateThemeStyles = (theme: Theme): string => {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-background: ${theme.colors.background};
      --color-text: ${theme.colors.text};
      --color-accent: ${theme.colors.accent};
      --color-neutral: ${theme.colors.neutral};
      ${theme.backgroundPattern ? `--background-pattern: url("${theme.backgroundPattern}");` : ''}
    }
  `;
};
