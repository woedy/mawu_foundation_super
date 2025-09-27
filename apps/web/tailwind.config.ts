import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF7A00',
          50: '#FFF4E6',
          100: '#FFE1BF',
          200: '#FFC48C',
          300: '#FFA659',
          400: '#FF9033',
          500: '#FF7A00',
          600: '#DB6400',
          700: '#B74F00',
          800: '#943C00',
          900: '#7A3100'
        },
        ink: {
          50: '#F5F7FA',
          100: '#E4E8EE',
          200: '#C8D0DC',
          300: '#AAB7C7',
          400: '#8793A8',
          500: '#627089',
          600: '#46546E',
          700: '#343F54',
          800: '#232A39',
          900: '#151B24'
        },
        sand: {
          50: '#FFFCF7',
          100: '#F9F1DE',
          200: '#F0E3C0',
          300: '#E5D1A2',
          400: '#D9BE84',
          500: '#CDAA66',
          600: '#B58F47',
          700: '#8D6E35',
          800: '#6B5127',
          900: '#4B371B'
        }
      },
      fontFamily: {
        display: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        body: ['"Work Sans"', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.12em', fontWeight: '600' }],
        'xs-tight': ['0.8125rem', { lineHeight: '1.125rem' }],
        'sm-plus': ['0.9375rem', { lineHeight: '1.4rem' }]
      },
      spacing: {
        '3xs': '0.25rem',
        '2xs': '0.375rem',
        '5.5': '1.375rem',
        '18': '4.5rem'
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem'
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(23, 34, 45, 0.35)',
        elevated: '0 35px 60px -25px rgba(23, 34, 45, 0.45)',
        glow: '0 0 0 6px rgba(255, 122, 0, 0.18)'
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: []
};

export default config;
