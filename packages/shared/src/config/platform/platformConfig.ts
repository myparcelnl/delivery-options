import * as LOCALE from '../../config/localeConfig';
import {Configuration} from '../../delivery-options.types';
import {PlatformName} from '@myparcel/sdk';
import {platformLocaleMap} from './platformLocaleMap';

export const platformConfig = (platform: PlatformName): Partial<Configuration> => {
  return LOCALE.CONFIG_MAP[platformLocaleMap[platform]];
};
