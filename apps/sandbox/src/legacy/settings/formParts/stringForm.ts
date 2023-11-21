import {
  ADDRESS_NOT_FOUND,
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_PICKUP_LOCATIONS,
  CLOSED,
  DELIVERY_TITLE,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  KEY_STRINGS,
  LOAD_MORE,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  RETRY,
  SHOW_PRICES,
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
        conditions: [inAnyCarrier(ALLOW_DELIVERY_OPTIONS)],
      },
    ],
  },
  {
    title: 'pickup',
    settings: [
      {
        key: KEY_STRINGS,
        name: LOAD_MORE,
        conditions: [inAnyCarrier(ALLOW_PICKUP_LOCATIONS)],
      },
      {
        key: KEY_STRINGS,
        name: PICKUP_LOCATIONS_LIST_BUTTON,
        conditions: [inAnyCarrier(ALLOW_PICKUP_LOCATIONS)],
      },
      {
        key: KEY_STRINGS,
        name: PICKUP_LOCATIONS_MAP_BUTTON,
        conditions: [inAnyCarrier(ALLOW_PICKUP_LOCATIONS)],
      },
    ],
  },
  {
    title: 'strings_other',
    settings: [
      {
        key: KEY_STRINGS,
        name: FROM,
        conditions: [SHOW_PRICES],
      },
      {
        key: KEY_STRINGS,
        name: RETRY,
      },
      {
        key: KEY_STRINGS,
        name: ADDRESS_NOT_FOUND,
      },
      {
        key: KEY_STRINGS,
        name: CLOSED,
        conditions: [inAnyCarrier(ALLOW_PICKUP_LOCATIONS)],
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
