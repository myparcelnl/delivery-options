import { CONFIG, ADDRESS } from '@myparcel/delivery-options';
import { getDefaultCarrierSettings } from '@Tests/unit/delivery-options/defaultCarrierSettings';
import { get, merge } from 'lodash-es';
import { createConfigBus, platformCarrierMap } from '../../../config';
import { defaultAddress } from '../../../data';
import { DEFAULT_PLATFORM } from '../../../data/keys';

/**
 * Get a configBus instance with the given default platform data and optional overrides.
 *
 * @param {MyParcelDeliveryOptions.Configuration|MyParcel.Platform} data - Data object. Platform name can be used as a
 *  shorthand.
 *
 * @returns {import('../../config/configBus')}
 */
export const mockConfigBus = (data = DEFAULT_PLATFORM) => {
  let platform;

  if (typeof data === 'string') {
    platform = data;
    data = {};
  } else {
    const platformInConfig = data.hasOwnProperty(CONFIG.KEY) && data[CONFIG.KEY].hasOwnProperty(CONFIG.PLATFORM);

    platform = platformInConfig
      ? data[CONFIG.KEY][CONFIG.PLATFORM]
      : DEFAULT_PLATFORM;
  }

  // Add default carrier settings for the first carrier of current platform if no carrier settings are present.
  if (!get(data, 'config.carrierSettings')) {
    merge(data, getDefaultCarrierSettings(platformCarrierMap[platform][0]));
  }

  data[CONFIG.KEY][CONFIG.PLATFORM] = platform;

  // Merge data into the default config.
  window.MyParcelConfig = {
    [ADDRESS.KEY]: defaultAddress[platform],
    ...data,
  };

  return createConfigBus();
};
