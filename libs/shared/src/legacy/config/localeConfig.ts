import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import {config as beConfig} from '@/data/locales/be/config';
import {strings as beStrings} from '@/data/locales/be/strings';
import {config as nlConfig} from '@/data/locales/nl/config';
import {strings as nlStrings} from '@/data/locales/nl/strings';
import {NETHERLANDS, BELGIUM} from '@myparcel/js-sdk/dist/constant/countries-iso2';

/**
 * @type {Object<string, MyParcelDeliveryOptions.Configuration>}
 */
export const CONFIG_MAP = {
  [NETHERLANDS]: {
    [CONFIG.KEY]: nlConfig,
    [STRINGS.KEY]: nlStrings,
  },
  [BELGIUM]: {
    [CONFIG.KEY]: beConfig,
    [STRINGS.KEY]: beStrings,
  },
};
