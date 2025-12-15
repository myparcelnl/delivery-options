import {mergeConfig, type UserConfig} from 'vite';
import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-dev/build-vite';
import baseConfig from './vite.config';
import {skipCssPlugin, getSharedConfig, createFilenameFormatter} from './private';

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return mergeConfig(baseConfig(env), {
    plugins: [skipCssPlugin()],

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
