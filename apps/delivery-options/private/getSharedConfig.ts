import {fileURLToPath} from 'node:url';
import {type UserConfig, type ConfigEnv} from 'vite';
import {resolveAlias} from '@myparcel-do/build-vite';
import {version} from '../package.json';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSharedConfig = ({mode}: ConfigEnv) => {
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __VERSION__: JSON.stringify(version),
      __CLASS_BASE__: JSON.stringify('myparcel-delivery-options'),
    },

    resolve: {
      alias: [
        ...resolveAlias,
        {
          find: 'pinia',
          replacement: fileURLToPath(new URL('../../../node_modules/pinia/dist/pinia.prod.cjs', import.meta.url)),
        },
      ],
    },
  } satisfies Partial<UserConfig>;
};
