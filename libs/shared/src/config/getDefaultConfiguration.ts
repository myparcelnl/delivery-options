/* eslint-disable max-lines-per-function */

import {type InputDeliveryOptionsConfiguration, type SupportedPlatformName} from '../types';
import {KEY_CONFIG, KEY_STRINGS} from '../data';
import {getDefaultStrings} from './getDefaultStrings';
import {getDefaultConfigForPlatform} from './getDefaultConfigForPlatform';

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 */
export const getDefaultConfiguration = <P extends SupportedPlatformName = SupportedPlatformName>(
  platform: P,
): Omit<Required<InputDeliveryOptionsConfiguration>, 'address' | 'components'> => {
  return {
    [KEY_CONFIG]: getDefaultConfigForPlatform(platform),
    [KEY_STRINGS]: getDefaultStrings(),
  };
};
