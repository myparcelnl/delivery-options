import {merge} from 'radash';
import {get} from '@vueuse/core';
import {
  CONFIG,
  defaultAddress,
  type DeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
  platformCarrierMap,
  type SupportedPlatformName,
} from '@myparcel-do/shared';
import {createConfigBus} from '../../legacy/config/configBus';
import {getDefaultCarrierSettings} from './defaultCarrierSettings';

/**
 * Get a configBus instance with the given default platform data and optional overrides.
 *
 * @param {MyParcelDeliveryOptions.Configuration|MyParcel.Platform} data - Data object. Platform name can be used as a
 *  shorthand.
 *
 */
export const mockConfigBus = (data: DeliveryOptionsConfiguration | SupportedPlatformName = DEFAULT_PLATFORM) => {
  let platform;

  if (typeof data === 'string') {
    platform = data;
    data = {};
  } else {
    const platformInConfig = data.hasOwnProperty(KEY_CONFIG) && data[KEY_CONFIG].hasOwnProperty(CONFIG.PLATFORM);

    platform = platformInConfig ? data[KEY_CONFIG][CONFIG.PLATFORM] : DEFAULT_PLATFORM;
  }

  // Add default carrier settings for the first carrier of current platform if no carrier settings are present.
  if (!get(data, 'config.carrierSettings')) {
    merge(data, getDefaultCarrierSettings(platformCarrierMap[platform][0]));
  }

  data[KEY_CONFIG][CONFIG.PLATFORM] = platform;

  // Merge data into the default config.
  window.MyParcelConfig = {
    [KEY_ADDRESS]: defaultAddress[platform],
    ...data,
  };

  return createConfigBus();
};
