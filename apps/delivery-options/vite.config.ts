import {createViteConfig} from '@myparcel-do/build-vite';

export default createViteConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'MyParcelDeliveryOptions',
    },
  },
});
