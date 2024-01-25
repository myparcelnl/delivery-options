import {mergeConfig} from 'vite';
import {createViteConfig} from '@myparcel-do/build-vite';
import baseConfig from './vite-myparcel.config';

export default createViteConfig((env) => {
  return mergeConfig(baseConfig(env), {
    build: {
      lib: {
        entry: 'src/main.ts',
        fileName: 'myparcel-lib',
        formats: ['es', 'cjs'],
        name: 'MyParcelDeliveryOptionsLib',
      },
      rollupOptions: {
        external: ['vue', 'leaflet'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  });
});
