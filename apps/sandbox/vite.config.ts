import {createViteConfig} from '@myparcel-do/build-vite';

export const PORT = 9860;

export default createViteConfig((env) => {
  const isProd = env.mode === 'production';

  return {
    base: isProd ? '/delivery-options/' : '/',

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
  };
});
