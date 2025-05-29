/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#855E42',
        secondary: '#4B3832',
        background: '#D6C4A8',
        text: '#2B2118',
        accent: '#2B2118',
        neutral: '#EFEFEF',
        // Extended palette
        'primary-light': '#A37D5F',
        'primary-dark': '#6A4B35',
        'secondary-light': '#6A5247',
        'secondary-dark': '#332721',
        'background-light': '#E8DBC7',
        'background-dark': '#C4B59A',
        'text-light': '#F1E7DC',
        'text-dark': '#1A140F',
      },
      fontFamily: {
        satisfy: ['Satisfy', 'cursive'],
        amatic: ['Amatic SC', 'cursive'],
        'crimson': ['Crimson Pro', 'serif'],
      },
      spacing: {
        base: '16px',
      },
      boxShadow: {
        'cozy': '0 4px 12px rgba(43, 33, 24, 0.1)',
        'cozy-hover': '0 8px 24px rgba(43, 33, 24, 0.15)',
      },
      backgroundImage: {
        'coffee-pattern': "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23855E42' fill-opacity='0.05'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
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
