/* eslint-disable no-magic-numbers */

import {
  getDefaultConfiguration,
  KEY_CONFIG,
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PICKUP,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
} from '@myparcel-do/shared';

export const demoConfiguration = (platform) => {
  return merge({}, getDefaultConfiguration(platform), {
    [KEY_CONFIG]: {
      [PRICE_EVENING_DELIVERY]: 2.49,
      [PRICE_MORNING_DELIVERY]: 4.95,
      [PRICE_ONLY_RECIPIENT]: 0.24,
      [PRICE_PICKUP]: -1,
      [PRICE_SIGNATURE]: 0.79,
      [PRICE_STANDARD_DELIVERY]: 0,
    },
  });
};
