/* eslint-disable max-lines-per-function */
import * as CONFIG from '../data/keys/configKeys';
import {Address, Configuration} from '../delivery-options.types';
import {
  DEFAULT_DELIVERY_DAYS_WINDOW,
  DEFAULT_PACKAGE_TYPE,
  DEFAULT_PLATFORM,
  DEFAULT_PRICE,
} from '../data/keys/settingsConsts';
import {PlatformName} from '@myparcel/sdk';
import {getDefaultStrings} from './defaultStrings';
import {merge} from 'lodash-unified';
import {platformConfig} from './platform/platformConfig';

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 */
export const defaultConfiguration = (platform: PlatformName = DEFAULT_PLATFORM): Configuration => {
  /**
   * Base delivery options configuration.
   */
  const baseConfig: Configuration = {
    address: {} as Address,

    config: {
      platform: DEFAULT_PLATFORM,
      currency: 'EUR',
      showPrices: true,
      showPriceSurcharge: false,

      packageType: DEFAULT_PACKAGE_TYPE,

      allowDeliveryOptions: true,
      allowEveningDelivery: true,
      allowMorningDelivery: true,
      allowOnlyRecipient: true,
      allowPickupLocations: true,
      allowSameDayDelivery: true,
      allowSignature: true,

      cutoffTime: '17:00',
      cutoffTimeSameDay: '9:30',
      deliveryDaysWindow: DEFAULT_DELIVERY_DAYS_WINDOW,
      dropOffDays: [1, 2, 3, 4, 5],
      dropOffDelay: 0,

      pricePackageTypeDigitalStamp: DEFAULT_PRICE,
      pricePackageTypeMailbox: DEFAULT_PRICE,

      priceEveningDelivery: DEFAULT_PRICE,
      priceMorningDelivery: DEFAULT_PRICE,
      priceOnlyRecipient: DEFAULT_PRICE,
      pricePickup: DEFAULT_PRICE,
      priceSameDayDelivery: DEFAULT_PRICE,
      priceSignature: DEFAULT_PRICE,
      priceStandardDelivery: DEFAULT_PRICE,

      featureAllowRetry: true,
      featureMaxPageItems: 5,
      featurePickupLocationsDefaultView: 'map',
      featurePickupShowDistance: true,
      featureShowDeliveryDate: true,

      /**
       * Default leaflet tile layer data.
       */
      pickupLocationsMapTileLayerData: JSON.stringify({
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        // eslint-disable-next-line max-len,vue/max-len
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
        maxZoom: 19,
      }),

      carrierSettings: {},
    },

    strings: getDefaultStrings(),
  };

  baseConfig[CONFIG.KEY][CONFIG.PLATFORM] = platform;

  return merge({}, baseConfig, platformConfig(platform));
};
