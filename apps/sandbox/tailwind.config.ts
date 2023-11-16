/* eslint-disable @typescript-eslint/no-magic-numbers,no-magic-numbers */
import {type Config} from 'tailwindcss';

const config: Config = {
  content: ['index.html', 'src/**/*.{js,ts,vue,scss}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Proxima Nova', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', {lineHeight: '1.125rem'}],
      sm: ['0.875rem', {lineHeight: '1.3125rem'}],
      base: ['1rem', {lineHeight: '1.5rem'}],
      lg: ['1.125rem', {lineHeight: '1.6875rem'}],
      xl: ['1.25rem', {lineHeight: '1.875rem'}],

      h1: ['2.25rem', {lineHeight: '2.25rem'}],
      h2: ['1.25rem', {lineHeight: '1.5rem'}],
      h3: ['1rem', {lineHeight: '1.1875rem'}],
      h4: ['0.875rem', {lineHeight: '1rem'}],
      h5: ['0.75rem', {lineHeight: '0.875rem'}],
      h6: ['0.625rem', {lineHeight: '0.75rem'}],
    },
    extend: {
      colors: {
        monstera: {
          50: '#F2F7F5',
          100: '#CFDEDA',
          200: '#9FBEB5',
          300: '#6F9D91',
          400: '#3F7D6C',
          500: '#0F5C47',
          600: '#0C4A39',
          700: '#09372B',
          800: '#06251C',
          900: '#03120E',
        },
        goldfish: {
          50: '#FFF7E8',
          100: '#FFE8CC',
          200: '#FFD199',
          300: '#FFBA66',
          400: '#FFA333',
          500: '#FF8C00',
          600: '#CC7000',
          700: '#995400',
          800: '#663800',
          900: '#331C00',
        },
      },
    },
  },
};

export default config;
