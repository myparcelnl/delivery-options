import {useMemoize} from '@vueuse/core';
import {validateDropOffDays, validateIsInRange} from '../validator';
import {type ConfigOption} from '../types';
import {OptionType} from '../enums';
import {
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
  CUTOFF_TIME_SAME_DAY,
  DELIVERY_DAYS_WINDOW,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
  FRIDAY_CUTOFF_TIME,
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
  SATURDAY_CUTOFF_TIME,
} from '../data';
import {defineOptionWithPrice} from './defineOptionWithPrice';
import {defineOption} from './defineOption';
import {defineDeliveryOption} from './defineDeliveryOption';

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
    parents: [ALLOW_DELIVERY_OPTIONS, FEATURE_SHOW_DELIVERY_DATE],
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
