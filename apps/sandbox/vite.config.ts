import {defineConfig} from 'vitest/config';
import customTsConfig from 'vite-plugin-custom-tsconfig';
import vue from '@vitejs/plugin-vue';

export const PORT = 9860;

const dirname = new URL('.', import.meta.url).pathname;

export default defineConfig((env) => {
  const isProd = env.mode === 'production';

  return {
    plugins: [vue(), customTsConfig({tsConfigPath: 'tsconfig.base.json'})],

    // TODO: uncomment when using github pages
    // base: isProd ? '/delivery-options/' : '/',

    server: {
      port: PORT,
    },

    build: {
      rollupOptions: {
        external: ['vue'],
      },
    },

    optimizeDeps: {
      // Optimizing this dependency causes the element and form injection keys to be mismatched.
      exclude: ['@myparcel/vue-form-builder'],
    },

    test: {
      setupFiles: [`${dirname}/../../libs/shared/src/__tests__/vitest-setup.ts`],
      coverage: {
        all: true,
        enabled: false,
        reporter: ['clover', 'text'],
      },
      environment: 'happy-dom',
      include: ['src/**/*.spec.ts'],
      passWithNoTests: true,
    },
  };
});
