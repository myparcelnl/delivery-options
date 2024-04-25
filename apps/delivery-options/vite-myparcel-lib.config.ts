import {writeFileSync} from 'node:fs';
import dts from 'vite-plugin-dts';
import {mergeConfig, type UserConfig} from 'vite';
import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-do/build-vite';
import {codecovVitePlugin} from '@codecov/vite-plugin';
import baseConfig from './vite.config';
import {getSharedConfig, createFilenameFormatter, skipCssPlugin} from './private';

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return mergeConfig(baseConfig(env), {
    plugins: [
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: '@myparcel/delivery-options',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
      skipCssPlugin(),
      isProd &&
        dts({
          entryRoot: 'src',
          rollupTypes: true,
          afterBuild: () => {
            // To please publint, we need to also have a .d.cts file
            writeFileSync('dist/index.d.cts', "export * from './index';");
          },
        }),
    ],

    build: {
      sourcemap: !isCI && isProd,
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

    ...getSharedConfig(env),
  } satisfies UserConfig);
});
