import {mergeConfig} from 'vite';
import {createViteConfig} from '@myparcel-do/build-vite';
import baseConfig from './vite.config';

export default createViteConfig((env) => {
  return mergeConfig(baseConfig(env), {
    build: {
      lib: {
        entry: 'src/main.ts',
        fileName: 'myparcel',
        formats: ['es', 'cjs'],
        name: 'MyParcelDeliveryOptions',
      },
    },
  });
});
