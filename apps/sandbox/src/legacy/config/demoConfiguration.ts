/* eslint-disable no-magic-numbers */

import {getDefaultConfiguration, KEY_CONFIG} from '@myparcel-do/shared';

export const demoConfiguration = (platform) => {
  return merge({}, getDefaultConfiguration(platform), {
    [KEY_CONFIG]: {
      [CarrierSetting.PriceEveningDelivery]: 2.49,
      [CarrierSetting.PriceMorningDelivery]: 4.95,
      [CarrierSetting.PriceOnlyRecipient]: 0.24,
      [CarrierSetting.PricePickup]: -1,
      [CarrierSetting.PriceSignature]: 0.79,
      [CarrierSetting.PriceStandardDelivery]: 0,
    },
  });
};
