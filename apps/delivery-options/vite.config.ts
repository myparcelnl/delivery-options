import {createViteConfig} from '@myparcel-do/build-vite';

const dirname = new URL('.', import.meta.url).pathname;

export default createViteConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'MyParcelDeliveryOptionsIndex',
    },
  },

  test: {
    setupFiles: [`${dirname}/../../libs/shared/src/__tests__/vitest-setup.ts`],
  },

  define: {
    __CLASS_BASE__: JSON.stringify('myparcel-delivery-options'),
  },
});
