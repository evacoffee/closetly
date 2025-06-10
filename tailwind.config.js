/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Coffee Shop Color Palette
        coffee: {
          50: '#F8F4EC',   // Lightest cream
          100: '#F1E9D9',
          200: '#E3D3B3',
          300: '#D5BD8D',
          400: '#C7A767',
          500: '#B99141',   // Medium coffee
          600: '#947434',
          700: '#6F5727',
          800: '#4A3A1A',
          900: '#251D0D',   // Darkest coffee
          950: '#1A1409',
        },
        // Brand colors with coffee theme
        primary: {
          DEFAULT: '#6F4E37',    // Coffee
          light: '#8B6B61',
          dark: '#4E342E',
          contrast: '#EFEBE9',
        },
        secondary: {
          DEFAULT: '#5D4037',  // Dark coffee
          light: '#8D6E63',
          dark: '#3E2723',
          contrast: '#FFFFFF',
        },
        background: {
          DEFAULT: '#3E2723',  // Dark roast
          light: '#5D4037',
          dark: '#260E04',
        },
        surface: {
          DEFAULT: '#4E342E',  // Slightly lighter than background
          light: '#6D4C45',
          dark: '#3E2723',
        },
        text: {
          DEFAULT: '#EFEBE9',  // Light cream
          primary: '#EFEBE9',
          secondary: '#D7CCC8',
          disabled: '#A1887F',
          hint: '#BCAAA4',
        },
        // Coffee-themed semantic colors
        success: '#81C784',
        warning: '#FFD54F',
        error: '#E57373',
        info: '#64B5F6',
        
        // Coffee-specific colors
        espresso: '#3E2723',
        cappuccino: '#D7CCC8',
        latte: '#EFEBE9',
        mocha: '#8D6E63',
        caramel: '#A67C52',
        cream: '#EFEBE9',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Fira Code', 'monospace'],
        satisfy: ['Satisfy', 'cursive'],
        amatic: ['Amatic SC', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      spacing: {
        base: '16px',
      },
      boxShadow: {
        'cozy': '0 4px 12px rgba(0, 0, 0, 0.25)',
        'cozy-hover': '0 8px 24px rgba(0, 0, 0, 0.35)',
        'elevate': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'coffee-pattern': "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D7CCC8' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'blink': 'blink 4s infinite',
        'tailWag': 'tailWag 2s ease-in-out infinite',
        'kittenBounce': 'kittenBounce 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        tailWag: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        kittenBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
