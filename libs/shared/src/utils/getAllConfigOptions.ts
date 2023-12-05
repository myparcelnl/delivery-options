import {useMemoize} from '@vueuse/core';
import {validateDropOffDays, validateIsInRange} from '../validator';
import {type ConfigOption} from '../types';
import {OptionType} from '../enums';
import {
  ADDRESS_NOT_FOUND,
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  CC,
  CITY,
  CLOSED,
  CUTOFF_TIME_SAME_DAY,
  DELIVERY_DAYS_WINDOW,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DELIVERY_EVENING_TITLE,
  DELIVERY_MORNING_TITLE,
  DELIVERY_SAME_DAY_DELIVERY_TITLE,
  DELIVERY_STANDARD_TITLE,
  DELIVERY_TITLE,
  DISCOUNT,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  ERROR_3212,
  ERROR_3224,
  ERROR_3501,
  ERROR_3505,
  ERROR_3506,
  ERROR_3728,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
  FRIDAY_CUTOFF_TIME,
  FROM,
  HEADER_DELIVERY_OPTIONS,
  LOAD_MORE,
  MONDAY_DELIVERY_TITLE,
  NUMBER,
  ONLY_RECIPIENT_TITLE,
  OPENING_HOURS,
  OPTIONS,
  PICK_UP,
  PICK_UP_FROM,
  PICKUP_LOCATIONS_LIST_BUTTON,
  PICKUP_LOCATIONS_MAP_BUTTON,
  PICKUP_TITLE,
  POSTAL_CODE,
  PRICE_EVENING_DELIVERY,
  PRICE_MONDAY_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  PRICE_PACKAGE_TYPE_MAILBOX,
  PRICE_PICKUP,
  PRICE_SAME_DAY_DELIVERY,
  PRICE_SATURDAY_DELIVERY,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
  RETRY,
  SATURDAY_CUTOFF_TIME,
  SATURDAY_DELIVERY_TITLE,
  SIGNATURE_TITLE,
  STREET,
  STRINGS_PACKAGE_TYPE_DIGITAL_STAMP,
  STRINGS_PACKAGE_TYPE_MAILBOX,
  WRONG_NUMBER_POSTAL_CODE,
  WRONG_POSTAL_CODE_CITY,
} from '../data';
import {defineOptionWithPrice} from './defineOptionWithPrice';
import {defineOption} from './defineOption';
import {defineDeliveryOption} from './defineDeliveryOption';

// eslint-disable-next-line max-lines-per-function
export const getAllConfigOptions = useMemoize((): ConfigOption[] => [
  ...defineOptionWithPrice(
    {
      key: ALLOW_DELIVERY_OPTIONS,
      perCarrier: true,
    },
    PRICE_STANDARD_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_PICKUP_LOCATIONS,
    },
    PRICE_PICKUP,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_MORNING_DELIVERY,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_MORNING_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_EVENING_DELIVERY,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_EVENING_DELIVERY,
  ),

  ...defineDeliveryOption(
    {
      key: ALLOW_SAME_DAY_DELIVERY,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_SAME_DAY_DELIVERY,
    CUTOFF_TIME_SAME_DAY,
  ),

  ...defineDeliveryOption(
    {
      key: ALLOW_MONDAY_DELIVERY,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_MONDAY_DELIVERY,
    SATURDAY_CUTOFF_TIME,
  ),

  ...defineDeliveryOption(
    {
      key: ALLOW_SATURDAY_DELIVERY,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_SATURDAY_DELIVERY,
    FRIDAY_CUTOFF_TIME,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_ONLY_RECIPIENT,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_ONLY_RECIPIENT,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_PACKAGE_TYPE_MAILBOX,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_PACKAGE_TYPE_MAILBOX,
  ),

  ...defineOptionWithPrice(
    {
      key: ALLOW_SIGNATURE,
      parents: [ALLOW_DELIVERY_OPTIONS],
    },
    PRICE_SIGNATURE,
  ),

  defineOption({
    key: DROP_OFF_DAYS,
    type: OptionType.Select,
    validators: [validateDropOffDays()],
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: DROP_OFF_DELAY,
    type: OptionType.Number,
    validators: [validateIsInRange(DROP_OFF_DELAY_MIN, DROP_OFF_DELAY_MAX)],
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: DELIVERY_DAYS_WINDOW,
    type: OptionType.Number,
    validators: [validateIsInRange(DELIVERY_DAYS_WINDOW_MIN, DELIVERY_DAYS_WINDOW_MAX)],
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: CUTOFF_TIME_SAME_DAY,
    type: OptionType.Time,
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: FEATURE_SHOW_DELIVERY_DATE,
    perCarrier: false,
  }),

  defineOption({
    key: FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    perCarrier: false,
    type: OptionType.Select,
  }),

  defineOption({
    key: FEATURE_PICKUP_SHOW_DISTANCE,
    perCarrier: false,
  }),
]);

export const getAllStringsOptions = () => {
  return [
    defineOption({key: CC, type: OptionType.String, perCarrier: false}),
    defineOption({key: CITY, type: OptionType.String, perCarrier: false}),
    defineOption({key: POSTAL_CODE, type: OptionType.String, perCarrier: false}),
    defineOption({key: NUMBER, type: OptionType.String, perCarrier: false}),
    defineOption({key: STREET, type: OptionType.String, perCarrier: false}),
    defineOption({key: ADDRESS_NOT_FOUND, type: OptionType.String, perCarrier: false}),
    defineOption({key: CLOSED, type: OptionType.String, perCarrier: false}),
    defineOption({key: DISCOUNT, type: OptionType.String, perCarrier: false}),
    defineOption({key: FROM, type: OptionType.String, perCarrier: false}),
    defineOption({key: LOAD_MORE, type: OptionType.String, perCarrier: false}),
    defineOption({key: RETRY, type: OptionType.String, perCarrier: false}),
    defineOption({key: PICK_UP, type: OptionType.String, perCarrier: false}),
    defineOption({key: PICK_UP_FROM, type: OptionType.String, perCarrier: false}),
    defineOption({key: OPENING_HOURS, type: OptionType.String, perCarrier: false}),
    defineOption({key: OPTIONS, type: OptionType.String, perCarrier: false}),
    defineOption({key: HEADER_DELIVERY_OPTIONS, type: OptionType.String, perCarrier: false}),
    defineOption({key: DELIVERY_EVENING_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: DELIVERY_MORNING_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: DELIVERY_SAME_DAY_DELIVERY_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: DELIVERY_STANDARD_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: DELIVERY_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: ONLY_RECIPIENT_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: PICKUP_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: SIGNATURE_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: WRONG_NUMBER_POSTAL_CODE, type: OptionType.String, perCarrier: false}),
    defineOption({key: WRONG_POSTAL_CODE_CITY, type: OptionType.String, perCarrier: false}),
    defineOption({key: MONDAY_DELIVERY_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: SATURDAY_DELIVERY_TITLE, type: OptionType.String, perCarrier: false}),
    defineOption({key: PICKUP_LOCATIONS_LIST_BUTTON, type: OptionType.String, perCarrier: false}),
    defineOption({key: PICKUP_LOCATIONS_MAP_BUTTON, type: OptionType.String, perCarrier: false}),
    defineOption({key: STRINGS_PACKAGE_TYPE_DIGITAL_STAMP, type: OptionType.String, perCarrier: false}),
    defineOption({key: STRINGS_PACKAGE_TYPE_MAILBOX, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3212, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3224, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3501, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3505, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3506, type: OptionType.String, perCarrier: false}),
    defineOption({key: ERROR_3728, type: OptionType.String, perCarrier: false}),
  ];
};
