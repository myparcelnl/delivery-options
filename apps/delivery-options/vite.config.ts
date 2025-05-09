import {type BuildOptions} from 'vite';
import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-do/build-vite';
import {getSharedConfig} from './private';

const dirname = new URL('.', import.meta.url).pathname;

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';
  // "Lib" is a build mode without Vue, to prevent conflicts with other libraries
  const isLib = process.env.BUILD_MODE === 'lib';
  const fileName = isLib ? 'index.lib' : 'index';
  const rollupOptions: BuildOptions['rollupOptions'] = {
    external: ['leaflet'],
    output: {
      globals: {
        leaflet: 'L',
      },
    },
  };

  // Offer a build without Vue, in case there are conflicts with running two versions of Vue in the same app
  if (isLib) {
    (rollupOptions.external as string[]).push('vue');
    (rollupOptions.output as Record<string, Record<string, string>>).globals.vue = 'Vue';
  }

  return {
    build: {
      sourcemap: !isCI && isProd,
      emptyOutDir: false,
      lib: {
        entry: 'src/index.ts',
        fileName,
        formats: ['es', 'cjs'],
        name: 'MyParcelDeliveryOptionsIndex',
      },
      rollupOptions,
    },

    test: {
      setupFiles: [`${dirname}/../../libs/shared/src/__tests__/vitest-setup.ts`],
    },

    ...getSharedConfig(env),
  };
});
