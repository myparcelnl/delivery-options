import dts from 'vite-plugin-dts';
import {mergeConfig, type UserConfig} from 'vite';
import {createViteConfig} from '@myparcel-do/build-vite';
import baseConfig from './vite.config';
import {getSharedConfig, createFilenameFormatter} from './private';

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return mergeConfig(baseConfig(env), {
    plugins: [isProd && dts({entryRoot: 'src'})],

    build: {
      emptyOutDir: false,
      lib: {
        entry: 'src/main.ts',
        fileName: createFilenameFormatter('myparcel.lib'),
        formats: ['es', 'umd'],
        name: 'MyParcelDeliveryOptionsLib',
      },
      rollupOptions: {
        external: ['vue', 'leaflet'],
        output: {
          globals: {
            vue: 'Vue',
            leaflet: 'L',
          },
        },
      },
    },

    ...getSharedConfig(),
  } satisfies UserConfig);
});
