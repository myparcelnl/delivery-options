import dts from 'vite-plugin-dts';
import {isCI} from 'ci-info';
import {createViteConfig} from '@myparcel-dev/do-build-vite';
import {version} from './package.json';

const dirname = new URL('.', import.meta.url).pathname;

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return {
    plugins: [dts({entryRoot: 'src'})],

    build: {
      sourcemap: !isCI && isProd,
      lib: {
        entry: {
          index: `${dirname}/src/index.ts`,
          testing: `${dirname}/src/__tests__/index.ts`,
        },
        formats: ['es'],
      },
    },

    define: {
      __VERSION__: JSON.stringify(version),
    },

    test: {
      setupFiles: [`${dirname}/src/__tests__/vitest-setup.ts`],
    },
  };
});
