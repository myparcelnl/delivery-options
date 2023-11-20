import {rangeValidator} from '../validator';
import {type CustomValidator} from '../types/validator.types';
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
} from '../legacy';
import {defineOptionWithPrice} from './defineOptionWithPrice';
import {defineOption} from './defineOption';
import {defineDeliveryOption} from './defineDeliveryOption';

export enum OptionGroup {
  PackageType = 'packageType',
  Delivery = 'delivery',
  ShipmentOption = 'shipmentOption',
  Feature = 'feature',
  DropOff = 'dropOff',
}

export enum OptionType {
  String = 'string',
  Boolean = 'boolean',
  Number = 'number',
  Currency = 'currency',
  Date = 'date',
  Time = 'time',
  Select = 'select',
}

export interface ConfigOption<T extends OptionType = OptionType> {
  hasCarrierToggle?: boolean;
  key: string;
  parents?: string[];
  type?: T;
  validators?: CustomValidator[];
}

export const ALL_OPTIONS: ConfigOption[] = [
  ...defineOptionWithPrice(
    {
      key: ALLOW_DELIVERY_OPTIONS,
      hasCarrierToggle: true,
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
    key: DROP_OFF_DELAY,
    type: OptionType.Number,
    validators: [rangeValidator(DROP_OFF_DELAY_MIN, DROP_OFF_DELAY_MAX)],
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: CUTOFF_TIME_SAME_DAY,
    type: OptionType.Time,
    parents: [ALLOW_DELIVERY_OPTIONS],
  }),

  defineOption({
    key: FEATURE_SHOW_DELIVERY_DATE,
    hasCarrierToggle: false,
  }),

  defineOption({
    key: FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    hasCarrierToggle: false,
    type: OptionType.Select,
  }),

  defineOption({
    key: FEATURE_PICKUP_SHOW_DISTANCE,
    hasCarrierToggle: false,
  }),
];
