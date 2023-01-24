import { createVuePlugin } from 'vite-plugin-vue2';

/**
 * @type {(env: Record<string, string>) => import('vite').UserConfig}
 */
const viteConfig = (env) => {
  const packageJson = require('./package.json');
  const repositoryUrl = packageJson.repository.url.replace('.git', '');

  return {
    base: env.mode === 'development' ? '/' : '/delivery-options/',

    build: {
      lib: {
        name: 'MyParcelDeliveryOptions',
        entry: 'src/main.js',
        formats: ['umd'],
        fileName: 'myparcel'
      },

      rollupOptions: {
        plugins: [
          {
            name: 'banner',
            renderChunk(code) {
              return `/**
    * @package ${packageJson.name}
    * @version ${packageJson.version}
    * @link ${repositoryUrl}
    */${code}`;
            },
          },
        ],
      },
    },

    plugins: [
      createVuePlugin(),
    ],
  };
};

export default viteConfig;
