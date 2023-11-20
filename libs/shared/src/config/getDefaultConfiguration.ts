/* eslint-disable max-lines-per-function */

import {
  API_BASE_URL,
  type DeliveryOptionsAddress,
  getDefaultStrings,
  LOCALE,
  PickupLocationsView,
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type InputDeliveryOptionsConfiguration, type SupportedPlatformName} from '../types';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SIGNATURE,
  CURRENCY,
  CUTOFF_TIME,
  CUTOFF_TIME_SAME_DAY,
  DEFAULT_DELIVERY_DAYS_WINDOW,
  DEFAULT_PACKAGE_TYPE,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
  KEY_CONFIG,
  KEY_STRINGS,
  PACKAGE_TYPE,
  PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
  PLATFORM,
  SHOW_PRICE_SURCHARGE,
  SHOW_PRICES,
} from '../legacy/data';

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 */
export const getDefaultConfiguration = <P extends SupportedPlatformName = SupportedPlatformName>(
  platform: P,
): Omit<InputDeliveryOptionsConfiguration, 'address'> => {
  return {
    [KEY_CONFIG]: {
      [API_BASE_URL]: 'https://api.myparcel.nl',
      [LOCALE]: 'nl-NL',
      [PLATFORM]: platform,
      [CURRENCY]: 'EUR',

      [SHOW_PRICES]: true,
      [SHOW_PRICE_SURCHARGE]: false,

      [PACKAGE_TYPE]: DEFAULT_PACKAGE_TYPE,

      [ALLOW_DELIVERY_OPTIONS]: true,
      [ALLOW_EVENING_DELIVERY]: true,
      [ALLOW_MORNING_DELIVERY]: true,
      [ALLOW_ONLY_RECIPIENT]: true,
      [ALLOW_PICKUP_LOCATIONS]: true,
      [ALLOW_SAME_DAY_DELIVERY]: true,
      [ALLOW_SIGNATURE]: true,

      [CUTOFF_TIME]: '17:00',
      [CUTOFF_TIME_SAME_DAY]: '09:30',
      [DELIVERY_DAYS_WINDOW]: DEFAULT_DELIVERY_DAYS_WINDOW,
      [DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
      [DROP_OFF_DELAY]: 0,

      // [PRICE_PACKAGE_TYPE_DIGITAL_STAMP]: DEFAULT_PRICE,
      // [PRICE_PACKAGE_TYPE_MAILBOX]: DEFAULT_PRICE,
      //
      // [PRICE_EVENING_DELIVERY]: DEFAULT_PRICE,
      // [PRICE_MORNING_DELIVERY]: DEFAULT_PRICE,
      // [PRICE_ONLY_RECIPIENT]: DEFAULT_PRICE,
      // [PRICE_PICKUP]: DEFAULT_PRICE,
      // [PRICE_SAME_DAY_DELIVERY]: DEFAULT_PRICE,
      // [PRICE_SIGNATURE]: DEFAULT_PRICE,
      // [PRICE_STANDARD_DELIVERY]: DEFAULT_PRICE,

      [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: PickupLocationsView.Map,
      [FEATURE_PICKUP_SHOW_DISTANCE]: true,
      [FEATURE_SHOW_DELIVERY_DATE]: true,

      /**
       * Default leaflet tile layer data.
       */
      [PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA]: JSON.stringify({
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        // eslint-disable-next-line max-len,vue/max-len
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
        maxZoom: 19,
      }),

      // [CARRIER_SETTINGS]: {},
    },

    [KEY_STRINGS]: getDefaultStrings(),
  } satisfies Replace<InputDeliveryOptionsConfiguration<P>, 'address', Partial<DeliveryOptionsAddress>>;
};
