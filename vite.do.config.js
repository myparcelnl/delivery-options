import { viteCommonConfig } from './vite-common.config';

/**
 * @type {import('vite').UserConfigFn}
 */
const viteConfig = (env) => {
  const common = viteCommonConfig(env);
  return {
    ...common,
    build: {
      ...common.build,
      cssCodeSplit: false,
      lib: 'MyParcel',
    },
  };
};

export default viteConfig;
