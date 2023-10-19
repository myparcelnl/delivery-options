import {createViteConfig} from '@myparcel-do/build-vite';
import viteConfig from './vite.config';

// @ts-expect-error todo
export default createViteConfig(async (env) => {
  const [parentConfig] = await Promise.all([viteConfig(env)]);

  return {
    ...parentConfig,
    build: {
      ...parentConfig.build,
      lib: {
        ...parentConfig.build?.lib,
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
  };
});
