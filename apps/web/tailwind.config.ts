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
        display: ['\"DM Sans\"', 'ui-sans-serif', 'system-ui'],
        body: ['\"Work Sans\"', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(23, 34, 45, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
