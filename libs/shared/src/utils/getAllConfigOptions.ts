import {useMemoize} from '@vueuse/core';
import {validateIsInRange} from '../validator';
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
  DELIVERY_DAYS_WINDOW,
  DELIVERY_DAYS_WINDOW_MAX,
  DELIVERY_DAYS_WINDOW_MIN,
  DROP_OFF_DELAY,
  DROP_OFF_DELAY_MAX,
  DROP_OFF_DELAY_MIN,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
  PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
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
} from '../data';
import {declareOptionWithPrice} from './declareOptionWithPrice';
import {declareOption} from './declareOption';

// eslint-disable-next-line max-lines-per-function
export const getAllConfigOptions = useMemoize((): ConfigOption[] => [
  ...declareOptionWithPrice(ALLOW_SAME_DAY_DELIVERY, PRICE_SAME_DAY_DELIVERY),
  ...declareOptionWithPrice(ALLOW_MONDAY_DELIVERY, PRICE_MONDAY_DELIVERY),
  ...declareOptionWithPrice(ALLOW_SATURDAY_DELIVERY, PRICE_SATURDAY_DELIVERY),

  ...declareOptionWithPrice({key: ALLOW_DELIVERY_OPTIONS, perCarrier: true}, PRICE_STANDARD_DELIVERY),

  ...declareOptionWithPrice(ALLOW_PICKUP_LOCATIONS, PRICE_PICKUP),
  ...declareOptionWithPrice(ALLOW_MORNING_DELIVERY, PRICE_MORNING_DELIVERY),
  ...declareOptionWithPrice(ALLOW_EVENING_DELIVERY, PRICE_EVENING_DELIVERY),
  ...declareOptionWithPrice(ALLOW_ONLY_RECIPIENT, PRICE_ONLY_RECIPIENT),
  ...declareOptionWithPrice(ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, PRICE_PACKAGE_TYPE_DIGITAL_STAMP),
  ...declareOptionWithPrice(ALLOW_PACKAGE_TYPE_MAILBOX, PRICE_PACKAGE_TYPE_MAILBOX),
  ...declareOptionWithPrice(ALLOW_SIGNATURE, PRICE_SIGNATURE),

  declareOption({
    key: DROP_OFF_DELAY,
    type: OptionType.Number,
    validators: [validateIsInRange(DROP_OFF_DELAY_MIN, DROP_OFF_DELAY_MAX)],
  }),

  declareOption({
    key: DELIVERY_DAYS_WINDOW,
    type: OptionType.Number,
    validators: [validateIsInRange(DELIVERY_DAYS_WINDOW_MIN, DELIVERY_DAYS_WINDOW_MAX)],
  }),

  declareOption({
    key: FEATURE_SHOW_DELIVERY_DATE,
    perCarrier: false,
  }),

  declareOption({
    key: FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    perCarrier: false,
    type: OptionType.Select,
  }),

  declareOption({
    key: FEATURE_PICKUP_SHOW_DISTANCE,
    perCarrier: false,
  }),

  declareOption({
    key: PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA,
    type: OptionType.String,
    perCarrier: false,
  }),
]);
