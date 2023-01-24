import {CONFIG} from '@myparcel/delivery-options';
import {FORM} from '@myparcel/delivery-options';
import {STRINGS} from '@myparcel/delivery-options';
import { inAnyCarrier } from '../../delivery-options/src/sandbox/settings/conditions/inAnyCarrier';

export const stringsForm = [
  {
    title: FORM.DELIVERY,
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.HEADER_DELIVERY_OPTIONS,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.DELIVERY_TITLE,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_DELIVERY_OPTIONS),
        ],
      },
    ],
  },
  {
    title: FORM.PICKUP,
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.LOAD_MORE,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.PICKUP_LOCATIONS_LIST_BUTTON,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.PICKUP_LOCATIONS_MAP_BUTTON,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
    ],
  },
  {
    title: 'strings_other',
    settings: [
      {
        key: STRINGS.KEY,
        name: STRINGS.FROM,
        conditions: [
          CONFIG.SHOW_PRICES,
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.RETRY,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.ADDRESS_NOT_FOUND,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.CLOSED,
        conditions: [
          inAnyCarrier(CONFIG.ALLOW_PICKUP_LOCATIONS),
        ],
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.WRONG_NUMBER_POSTAL_CODE,
      },
      {
        key: STRINGS.KEY,
        name: STRINGS.WRONG_POSTAL_CODE_CITY,
      },
    ],
  },
];
