import address from './forms/address.js';
import codeFormats from './forms/codeFormats.js';
import objectGet from 'lodash-unified/get';
import previews from '@/sandbox/config/tabs/previews';
import settings from '@/sandbox/config/tabs/settings';

const config = {
  forms: {address, codeFormats},
  tabs: {previews, settings},
};

export const configObject = {
  get(item) {
    return Object.freeze(objectGet(config, item));
  },
};
