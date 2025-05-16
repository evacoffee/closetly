export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  neutral: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  author: string;
  colors: ThemeColors;
  backgroundPattern?: string;
  preview?: string;
}

export const defaultThemes: Theme[] = [
  {
    id: 'cozy-coffee',
    name: 'Cozy Coffee',
    description: 'Warm and inviting coffee shop inspired theme',
    author: 'FIT Team',
    colors: {
      primary: '#855E42',
      secondary: '#4B3832',
      background: '#D6C4A8',
      text: '#F1E7DC',
      accent: '#2B2118',
      neutral: '#EFEFEF',
    }
  },
  {
    id: 'modern-mint',
    name: 'Modern Mint',
    description: 'Fresh and clean minimalist theme',
    author: 'FIT Team',
    colors: {
      primary: '#2D6A4F',
      secondary: '#1B4332',
      background: '#D8F3DC',
      text: '#FFFFFF',
      accent: '#081C15',
      neutral: '#F8F9FA',
    }
  },
  {
    id: 'night-mode',
    name: 'Night Mode',
    description: 'Easy on the eyes dark theme',
    author: 'FIT Team',
    colors: {
      primary: '#7C3AED',
      secondary: '#5B21B6',
      background: '#1E1B4B',
      text: '#F3F4F6',
      accent: '#4C1D95',
      neutral: '#374151',
    }
  }
];

export interface CustomTheme extends Theme {
  installDate: Date;
}

export const isCustomTheme = (theme: Theme): theme is CustomTheme => {
  return 'installDate' in theme;
}
