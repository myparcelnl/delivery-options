import * as CONFIG from '../data/keys/configKeys';
import * as STRINGS from '../data/keys/stringsKeys';
import {COUNTRIES} from '@myparcel/sdk';
import {Configuration} from '../delivery-options.types';
import {config as beConfig} from '../data/locales/be/config';
import {strings as beStrings} from '../data/locales/be/strings';
import {config as nlConfig} from '../data/locales/nl/config';
import {strings as nlStrings} from '../data/locales/nl/strings';

export const CONFIG_MAP: Record<string, Partial<Configuration>> = {
  [COUNTRIES.NETHERLANDS]: {
    [CONFIG.KEY]: nlConfig,
    [STRINGS.KEY]: nlStrings,
  },
  [COUNTRIES.BELGIUM]: {
    [CONFIG.KEY]: beConfig,
    [STRINGS.KEY]: beStrings,
  },
};

/**
 * TODO: Temporary hard coded requirements. Depends on https://jira.dmp.zone/browse/MY-16173.
 */
export const addressRequirements: Record<string, [string, string[]]> = {
  [COUNTRIES.NETHERLANDS]: ['postalCode', ['number', 'street']],
  [COUNTRIES.BELGIUM]: ['postalCode', ['city', 'number', 'street']],
};
