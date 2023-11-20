/* eslint-disable @typescript-eslint/no-magic-numbers,no-magic-numbers */
import {type Config} from 'tailwindcss';

const config: Config = {
  content: [`${__dirname}/src/**/*.{js,ts,vue,scss}`],
  prefix: 'mp-',
};

export default config;
