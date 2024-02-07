import {fileURLToPath} from 'node:url';
import {type UserConfig} from 'vite';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSharedConfig = () => {
  return {
    define: {
      'process.env': process.env,
      __CLASS_BASE__: JSON.stringify('myparcel-delivery-options'),
      __URL_DOCUMENTATION__: JSON.stringify('https://developer.myparcel.nl/documentation/60.delivery-options.html'),
      __URL_SANDBOX__: JSON.stringify('https://alpha--myparcel-delivery-options.netlify.app'),
    },

    resolve: {
      alias: {
        pinia: fileURLToPath(new URL('../../../node_modules/pinia/dist/pinia.prod.cjs', import.meta.url)),
      },
    },
  } satisfies Partial<UserConfig>;
};
