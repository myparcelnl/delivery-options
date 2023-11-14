import {CONFIG, DELIVERY, KEY_STRINGS, PICKUP, STRINGS} from '@myparcel-do/shared';
import {inAnyCarrier} from '../conditions/inAnyCarrier';

export const stringsForm = [
  {
    title: DELIVERY,
    settings: [
      {
        key: KEY_STRINGS,
        name: STRINGS.HEADER_DELIVERY_OPTIONS,
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.DELIVERY_TITLE,
        conditions: [inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS)],
      },
    ],
  },
  {
    title: PICKUP,
    settings: [
      {
        key: KEY_STRINGS,
        name: STRINGS.LOAD_MORE,
        conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.PICKUP_LOCATIONS_LIST_BUTTON,
        conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.PICKUP_LOCATIONS_MAP_BUTTON,
        conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
      },
    ],
  },
  {
    title: 'strings_other',
    settings: [
      {
        key: KEY_STRINGS,
        name: STRINGS.FROM,
        conditions: [CONFIG.SHOW_PRICES],
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.RETRY,
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.ADDRESS_NOT_FOUND,
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.CLOSED,
        conditions: [inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS)],
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.WRONG_NUMBER_POSTAL_CODE,
      },
      {
        key: KEY_STRINGS,
        name: STRINGS.WRONG_POSTAL_CODE_CITY,
      },
    ],
  },
];
