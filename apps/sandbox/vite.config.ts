import {defineConfig} from 'vitest/config';
import customTsConfig from 'vite-plugin-custom-tsconfig';
import vue from '@vitejs/plugin-vue';
import {resolveAlias} from '@myparcel-do/build-vite';

export const PORT = 9860;

const dirname = new URL('.', import.meta.url).pathname;

export default defineConfig(({mode}) => {
  const isProd = mode === 'production';

  return {
    plugins: [vue(), customTsConfig({tsConfigPath: 'tsconfig.base.json'})],

    base: isProd && !process.env.NETLIFY ? '/delivery-options/' : '/',

    server: {
      port: PORT,
    },

    build: {
      minify: isProd,
      sourcemap: !isProd,
      rollupOptions: {
        external: ['vue', 'leaflet'],
        output: {
          globals: {
            leaflet: 'L',
          },
        },
      },
    },

    resolve: {
      alias: resolveAlias,
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    test: {
      setupFiles: [`${dirname}/../../libs/shared/src/__tests__/vitest-setup.ts`],
      coverage: {
        all: true,
        enabled: false,
        reporter: ['clover', 'text'],
      },
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts'],
      passWithNoTests: true,
    },
  };
});
