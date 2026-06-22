import tsconfigPaths from 'vite-tsconfig-paths';
import customTsConfig from 'vite-plugin-custom-tsconfig';
import {mergeConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

/** @type {import('vitest/config').UserConfigFn} */
const createCommonViteConfig = (env) => {
  const isProd = env.mode === 'production';
  return {
    // Resolve the monorepo aliases from tsconfig.base.json `paths` (single source of truth).
    // `loose: true` also resolves them in *.spec.ts files, which tsconfig.base.json excludes —
    // otherwise those imports fall back to the built dist and load a second Vue copy in tests.
    plugins: [vue(), customTsConfig({tsConfigPath: 'tsconfig.base.json'}), tsconfigPaths({loose: true})],

    build: {
      minify: isProd,
      sourcemap: !isProd,
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
