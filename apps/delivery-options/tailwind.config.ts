/* eslint-disable @typescript-eslint/no-magic-numbers,no-magic-numbers */
import {type Config} from 'tailwindcss';
import containerQueriesPlugin from '@tailwindcss/container-queries';

const config: Config = {
  plugins: [containerQueriesPlugin],
  content: ['index.html', 'src/**/*.{js,ts,vue,scss}', '../../libs/shared/src/**/*.{js,ts,vue,scss}'],
  darkMode: 'class',
  prefix: 'mp-',

  theme: {
    extend: {
      maxHeight: ({theme}) => theme('height'),
      maxWidth: ({theme}) => theme('width'),
      minHeight: ({theme}) => theme('height'),
      minWidth: ({theme}) => theme('width'),
    },
  },
};

export default config;
