/* eslint-disable max-lines-per-function */

import {assign} from 'radash';
import {useNavigatorLanguage} from '@vueuse/core';
import {PlatformName} from '@myparcel/constants';
import {type DeliveryOptionsConfig, type InputDeliveryOptionsConfiguration, type SupportedPlatformName} from '../types';
import {PickupLocationsView} from '../enums';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SIGNATURE,
  API_BASE_URL,
  CARRIER_SETTINGS,
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
  INITIAL,
  KEY_CONFIG,
  KEY_STRINGS,
  LOCALE,
  PACKAGE_TYPE,
  PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
  PLATFORM,
  SHOW_PRICE_SURCHARGE,
  SHOW_PRICES,
} from '../data';
import {getDefaultStrings} from './getDefaultStrings';

const PLATFORM_DEFAULTS = Object.freeze({
  [PlatformName.MyParcel]: {
    [FEATURE_PICKUP_SHOW_DISTANCE]: true,
    [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: PickupLocationsView.Map,
  },

  [PlatformName.SendMyParcel]: {
    [FEATURE_PICKUP_SHOW_DISTANCE]: false,
    [FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: PickupLocationsView.List,
  },
}) satisfies Readonly<Partial<Record<SupportedPlatformName, Partial<DeliveryOptionsConfig>>>>;

export const getDefaultConfig = (platform: SupportedPlatformName): Required<DeliveryOptionsConfig> => {
  const {language} = useNavigatorLanguage();

  const platformDefaults = PLATFORM_DEFAULTS[platform] ?? {};

  return assign(
    {
      [API_BASE_URL]: 'https://api.myparcel.nl',
      [LOCALE]: language.value ?? 'nl-NL',
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
      [ALLOW_MONDAY_DELIVERY]: true,

      [ALLOW_SIGNATURE]: true,

      [CUTOFF_TIME]: '17:00',
      [CUTOFF_TIME_SAME_DAY]: '09:30',
      [DELIVERY_DAYS_WINDOW]: DEFAULT_DELIVERY_DAYS_WINDOW,
      [DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
      [DROP_OFF_DELAY]: 0,

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

      [CARRIER_SETTINGS]: {},

      [INITIAL]: {},
    },
    platformDefaults,
  );
};

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 */
export const getDefaultConfiguration = <P extends SupportedPlatformName = SupportedPlatformName>(
  platform: P,
): Omit<Required<InputDeliveryOptionsConfiguration>, 'address' | 'components'> => {
  return {
    [KEY_CONFIG]: getDefaultConfig(platform),
    [KEY_STRINGS]: getDefaultStrings(),
  };
};
