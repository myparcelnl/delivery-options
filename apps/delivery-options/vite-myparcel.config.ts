import {mergeConfig, type UserConfig} from 'vite';
import {createViteConfig} from '@myparcel-do/build-vite';
import baseConfig from './vite.config';
import {getSharedConfig, createFilenameFormatter} from './private';

export default createViteConfig((env) => {
  return mergeConfig(baseConfig(env), {
    build: {
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
