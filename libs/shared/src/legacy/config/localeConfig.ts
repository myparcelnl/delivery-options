import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {strings as nlStrings} from '../data/locales/nl/strings';
import {config as nlConfig} from '../data/locales/nl/config';
import {strings as beStrings} from '../data/locales/be/strings';
import {config as beConfig} from '../data/locales/be/config';
import {KEY_CONFIG, KEY_STRINGS} from '../../data';

/**
 * @type {Object<string, MyParcelDeliveryOptions.Configuration>}
 */
export const CONFIG_MAP = {
  [NETHERLANDS]: {
    [KEY_CONFIG]: nlConfig,
    [KEY_STRINGS]: nlStrings,
  },
  [BELGIUM]: {
    [KEY_CONFIG]: beConfig,
    [KEY_STRINGS]: beStrings,
  },
};
