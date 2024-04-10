import {mergeConfig, type UserConfig} from 'vite';
import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-do/build-vite';
import baseConfig from './vite.config';
import {skipScssPlugin} from './skip-scss-plugin';
import {getSharedConfig, createFilenameFormatter} from './private';

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return mergeConfig(baseConfig(env), {
    plugins: [skipScssPlugin()],

    build: {
      sourcemap: !isCI && isProd,
      emptyOutDir: false,
      lib: {
        entry: 'src/main.ts',
        fileName: createFilenameFormatter('myparcel'),
        formats: ['es', 'umd'],
        name: 'MyParcelDeliveryOptions',
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

    ...getSharedConfig(env),
  } satisfies UserConfig);
});
