import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { config as beConfig } from '@/data/locales/be/config';
import { strings as beStrings } from '@/data/locales/be/strings';
import { countryCodes } from '@/data/keys/countryCodes';
import { config as nlConfig } from '@/data/locales/nl/config';
import { strings as nlStrings } from '@/data/locales/nl/strings';

/**
 * @type {Object<string, MyParcelDeliveryOptions.Configuration>}
 */
export const CONFIG_MAP = {
  [countryCodes.NETHERLANDS]: {
    [CONFIG.KEY]: nlConfig,
    [STRINGS.KEY]: nlStrings,
  },
  [countryCodes.BELGIUM]: {
    [CONFIG.KEY]: beConfig,
    [STRINGS.KEY]: beStrings,
  },
};
