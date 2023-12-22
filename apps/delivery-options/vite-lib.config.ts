import {createViteConfig} from '@myparcel-do/build-vite';

const dirname = new URL('.', import.meta.url).pathname;

export default createViteConfig(() => {
  return {
    build: {
      lib: {
        entry: 'src/index.ts',
        fileName: 'index',
        formats: ['es', 'cjs'],
        name: 'MyParcelDeliveryOptionsLib',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },

    test: {
      setupFiles: [`${dirname}src/__tests__/vitest-setup.ts`],
    },
  };
});
