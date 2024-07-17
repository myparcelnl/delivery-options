import path from 'node:path';
import customTsConfig from 'vite-plugin-custom-tsconfig';
import {mergeConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const dirname = path.dirname(new URL(import.meta.url).pathname);

/** @type {import('vitest/config').Alias[]} */
export const resolveAlias = [
  {
    find: '@myparcel/delivery-options',
    replacement: path.resolve(dirname, '../../apps/delivery-options/src'),
  },
  {
    find: '@myparcel-do/shared/testing',
    replacement: path.resolve(dirname, '../../libs/shared/src/__tests__'),
  },
  {
    find: /^@myparcel-do\/(.+)/,
    replacement: path.resolve(dirname, '../../libs/$1/src'),
  },
];

/** @type {import('vitest/config').UserConfigFn} */
const createCommonViteConfig = (env) => {
  const isProd = env.mode === 'production';
  return {
    plugins: [vue(), customTsConfig({tsConfigPath: 'tsconfig.base.json'})],

    build: {
      minify: isProd,
      sourcemap: !isProd,
    },

    resolve: {
      alias: resolveAlias,
    },

    test: {
      coverage: {
        all: true,
        enabled: false,
        reporter: ['clover', 'text', ...(isProd ? [] : ['html'])],
        include: ['src/**', '!**/*.story.*'],
      },
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts'],
      passWithNoTests: true,
    },
  };
};

/** @type {import('.').createViteConfig} */
export const createViteConfig = (config) => async (env) => {
  let resolvedConfig = config ?? {};

  if (typeof config === 'function') {
    resolvedConfig = await config(env);
  }

  return mergeConfig(await createCommonViteConfig(env), resolvedConfig);
};
