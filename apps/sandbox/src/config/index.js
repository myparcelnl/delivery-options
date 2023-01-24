import address from './forms/address';
import codeFormats from './forms/codeFormats';
import{ objectGet } from 'lodash-unified';
import previews from '../../delivery-options/src/sandbox/config/tabs/previews';
import settings from '../../delivery-options/src/sandbox/config/tabs/settings';

const config = {
  forms: { address, codeFormats },
  tabs: { previews, settings },
};

export const configObject = {
  get(item) {
    return Object.freeze(objectGet(config, item));
  },
};
