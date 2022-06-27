import { createVuePlugin } from 'vite-plugin-vue2';
import { viteCommonConfig } from './vite-common.config';

/**
 * @type {(env: Record<string, string>) => import('vite').UserConfig}
 */
const viteConfig = (env) => {
  const common = viteCommonConfig(env);
  const packageJson = require('./package.json');

  const repositoryUrl = packageJson.repository.url.replace('.git', '');

  const commitHash = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim();

  console.log(commitHash);
  console.log(repositoryUrl);

  return {
    ...common,
    base: env.mode === 'development' ? '/' : '/delivery-options/',

    plugins: [
      createVuePlugin(),
    ],

    // define: {
    //   COMMIT_HASH: commitHash,
    //   REPOSITORY_URL: repositoryUrl,
    // },
  };
};

export default viteConfig;
