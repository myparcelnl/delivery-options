import {
  ADDRESS_NOT_FOUND,
  CLOSED,
  DELIVERY_TITLE,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  KEY_STRINGS,
  LOAD_MORE,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  WRONG_NUMBER_POSTAL_CODE,
  WRONG_POSTAL_CODE_CITY,
} from '@myparcel-do/shared';
import {inAnyCarrier} from '../conditions/inAnyCarrier';

export const stringsForm = [
  {
    title: 'delivery',
    settings: [
      {
        key: KEY_STRINGS,
        name: HEADER_DELIVERY_OPTIONS,
      },
      {
        key: KEY_STRINGS,
        name: DELIVERY_TITLE,
        conditions: [inAnyCarrier(CarrierSetting.AllowDeliveryOptions)],
      },
    ],
  },
  {
    title: 'pickup',
    settings: [
      {
        key: KEY_STRINGS,
        name: LOAD_MORE,
        conditions: [inAnyCarrier(CarrierSetting.AllowPickupLocations)],
      },
      {
        key: KEY_STRINGS,
        name: PICKUP_LOCATIONS_LIST_BUTTON,
        conditions: [inAnyCarrier(CarrierSetting.AllowPickupLocations)],
      },
      {
        key: KEY_STRINGS,
        name: PICKUP_LOCATIONS_MAP_BUTTON,
        conditions: [inAnyCarrier(CarrierSetting.AllowPickupLocations)],
      },
    ],
  },
  {
    title: 'strings_other',
    settings: [
      {
        key: KEY_STRINGS,
        name: FROM,
        conditions: [ConfigSetting.ShowPrices],
      },
      {
        key: KEY_STRINGS,
        name: ADDRESS_NOT_FOUND,
      },
      {
        key: KEY_STRINGS,
        name: CLOSED,
        conditions: [inAnyCarrier(CarrierSetting.AllowPickupLocations)],
      },
      {
        key: KEY_STRINGS,
        name: WRONG_NUMBER_POSTAL_CODE,
      },
      {
        key: KEY_STRINGS,
        name: WRONG_POSTAL_CODE_CITY,
      },
    ],
  },
];
