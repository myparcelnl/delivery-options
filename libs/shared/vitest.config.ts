import {createViteConfig} from '@myparcel-do/build-vite';

const dirname = new URL('.', import.meta.url).pathname;
export default createViteConfig({
  test: {
    setupFiles: [`${dirname}/src/__tests__/vitest-setup.ts`],
  },
});
