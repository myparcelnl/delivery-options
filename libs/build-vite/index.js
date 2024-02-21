import customTsConfig from 'vite-plugin-custom-tsconfig';
import {mergeConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

/** @type {import('vitest/config').UserConfigFn} */
const createCommonViteConfig = (env) => {
  const isProd = env.mode === 'production';

  return {
    plugins: [vue(), customTsConfig({tsConfigPath: 'tsconfig.base.json'})],

    build: {
      minify: isProd,
      sourcemap: !isProd,
    },

    test: {
      coverage: {
        all: true,
        enabled: false,
        reporter: ['clover', 'text', ...(isProd ? [] : ['html'])],
        include: ['src/**'],
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
