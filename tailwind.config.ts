import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#111111',
          50: '#1a1a1a',
          100: '#222222',
          200: '#2a2a2a',
          300: '#333333',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#EDE8DF',
        },
        gold: {
          DEFAULT: '#D4A843',
          light: '#E0C068',
          dark: '#B8922E',
        },
        forest: {
          DEFAULT: '#2D5016',
          light: '#3A6A1E',
        },
        terracotta: {
          DEFAULT: '#C4704B',
          light: '#D4856A',
        },
        sage: {
          DEFAULT: '#8B9A7B',
          light: '#A3B093',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.5rem', { lineHeight: '1.3' }],
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
