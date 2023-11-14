import settings from './tabs/settings';
import previews from './tabs/previews';
import codeFormats from './forms/codeFormats';
import address from './forms/address';

const config = {
  forms: {
    address,
    codeFormats,
  },
  tabs: {
    previews,
    settings,
  },
};

export const configObject = {
  get(item) {
    return Object.freeze(objectGet(config, item));
  },
};
