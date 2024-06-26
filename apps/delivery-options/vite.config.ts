import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-do/build-vite';
import {getSharedConfig} from './private';

const dirname = new URL('.', import.meta.url).pathname;

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return {
    build: {
      sourcemap: !isCI && isProd,
      emptyOutDir: false,
      lib: {
        entry: 'src/index.ts',
        fileName: 'index',
        formats: ['es', 'cjs'],
        name: 'MyParcelDeliveryOptionsIndex',
      },
      rollupOptions: {
        external: ['leaflet'],
        output: {
          globals: {
            leaflet: 'L',
          },
        },
      },
    },

    test: {
      setupFiles: [`${dirname}/../../libs/shared/src/__tests__/vitest-setup.ts`],
    },

    ...getSharedConfig(env),
  };
});
