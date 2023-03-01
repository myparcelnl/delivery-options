import customTsConfigPlugin from 'vite-plugin-custom-tsconfig';
import dts from 'vite-plugin-dts';
import {mergeConfig} from 'vite';

const external = [
  /^@myparcel-do\//,
  /^@myparcel\//,
  '@tanstack/vue-query',
  '@types/lodash-es',
  '@vue/test-utils',
  '@vueuse/core',
  'lodash',
  'lodash-es',
  'lodash-unified',
  'pinia',
  'tsup',
  'vite',
  'vitest',
  'vue',
];

/** @type {import('vitest/config').UserConfigFn} */
const createCommonViteConfig = (env) => {
  const isProd = env.mode === 'production';

  return {
    plugins: [
      isProd && dts({skipDiagnostics: true, entryRoot: 'src', compilerOptions: {incremental: true}}),
      customTsConfigPlugin(),
    ],

    build: {
      outDir: 'lib',
      minify: isProd,
      rollupOptions: {
        external,
        output: {
          preserveModules: true,
          globals: {
            vue: 'Vue',
          },
        },
      },
      lib: {
        entry: 'src/index.ts',
        formats: ['es'],
        fileName: 'index',
      },
    },

    test: {
      environment: 'happy-dom',
      coverage: {
        enabled: false,
        reporter: ['text', 'clover'],
      },
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
