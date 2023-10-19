/* eslint-disable no-magic-numbers */
import * as CONFIG from '@/data/keys/configKeys';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import merge from 'lodash-es/merge';

export const demoConfiguration = (platform) => {
  return merge(
    {},
    defaultConfiguration(platform),
    {
      [CONFIG.KEY]: {
        [CONFIG.PRICE_EVENING_DELIVERY]: 2.49,
        [CONFIG.PRICE_MORNING_DELIVERY]: 4.95,
        [CONFIG.PRICE_ONLY_RECIPIENT]: 0.24,
        [CONFIG.PRICE_PICKUP]: -1,
        [CONFIG.PRICE_SIGNATURE]: 0.79,
        [CONFIG.PRICE_STANDARD_DELIVERY]: 0,
      },
    },
  );
};
