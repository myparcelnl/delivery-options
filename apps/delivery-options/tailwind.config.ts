/* eslint-disable @typescript-eslint/no-magic-numbers,no-magic-numbers */
import {type Config} from 'tailwindcss';
import containerQueriesPlugin from '@tailwindcss/container-queries';

const config: Config = {
  plugins: [containerQueriesPlugin],
  content: [`${__dirname}/src/**/*.{js,ts,vue,scss}`],
  prefix: 'mp-',
  darkMode: 'class',
};

export default config;
