import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

/**
 * @type {(env: Record<string, string>) => import('vite').UserConfig}
 */
const viteConfig = (env) => {
  // const repositoryUrl = repository.url.replace('.git', '');
  // const commitHash = require('child_process')
  //   .execSync('git rev-parse HEAD')
  //   .toString()
  //   .trim();

  return {
    base: env.mode === 'development' ? '/' : '/delivery-options/',

    plugins: [
      createVuePlugin(),
    ],

    build: {
      cssCodeSplit: false,
      lib: 'MyParcel',

    },

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    define: {
      // COMMIT_HASH: commitHash,
      // REPOSITORY_URL: repositoryUrl,
    },
  };
};

export default viteConfig;
