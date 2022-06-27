import banner from 'vite-plugin-banner';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

/**
 * @type {import('vite').UserConfigFn}
 */
export const viteCommonConfig = (env) => {
  const packageJson = require('./package.json');

  return {
    plugins: [
      createVuePlugin(),
      banner(`${packageJson.name}@${packageJson.version}`),
    ],

    build: {
      emptyOutDir: false,
    },

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
};
