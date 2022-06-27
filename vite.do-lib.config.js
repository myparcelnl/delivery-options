import deliveryOptionsConfig from './vite.do.config';

/**
 * @type {import('vite').UserConfigFn}
 */
const viteConfig = (env) => {
  console.log(import.meta.env.DEV);

  return {
    ...deliveryOptionsConfig,
    base: env.mode === 'development' ? '/' : '/delivery-options/',

    build: {
      cssCodeSplit: false,
      lib: 'MyParcel',
      rollupOptions: {
        input: 'src/delivery-options/main.js',
        external: ['vue'],
      },
      minify: 'terser',
      terserOptions: {
        mangle: {
          keep_classnames: false,
          module: true,
          toplevel: true,
          keep_fnames: false,
          properties: true,
        },
        sourceMap: false,
      },
    },

  };
};

export default viteConfig;
