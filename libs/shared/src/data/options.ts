import {booleanValidator, numberValidator, rangeValidator, stringValidator} from '../validator';
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
  FEATURE_MAX_PAGE_ITEMS,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
  PRICE_EVENING_DELIVERY,
  PRICE_MORNING_DELIVERY,
  PRICE_ONLY_RECIPIENT,
  PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  PRICE_PACKAGE_TYPE_MAILBOX,
  PRICE_PICKUP,
  PRICE_SAME_DAY_DELIVERY,
  PRICE_SIGNATURE,
  PRICE_STANDARD_DELIVERY,
  SATURDAY_CUTOFF_TIME,
} from '../legacy';

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
  group: OptionGroup;
  key: string;
  parents?: string[];
  type?: T;
  validators?: CustomValidator[];
}

const defineOption = <O extends ConfigOption>(option: O): O => {
  const resolvedOption = {
    validators: [],
    type: OptionType.Boolean,
    ...option,
  };

  switch (option.type) {
    case OptionType.Number:
      resolvedOption.validators.push(numberValidator());
      break;

    case OptionType.String:
      resolvedOption.validators.push(stringValidator());
      break;

    case OptionType.Boolean:
      resolvedOption.validators.push(booleanValidator());
      break;
  }

  return resolvedOption;
};

const defineOptionWithPrice = <O extends ConfigOption>(option: O, priceKey: string): [O, ConfigOption] => {
  const resolvedOption = defineOption(option);

  return [
    resolvedOption,

    defineOption({
      group: option.group,
      key: priceKey,
      parents: [...(option.parents ?? []), resolvedOption.key],
      type: OptionType.Currency,
    }),
  ];
};

const defineDeliveryOption = <O extends ConfigOption, C extends undefined | string>(
  option: O,
  priceKey: string,
  cutOffTimeKey?: C,
): C extends string ? [O, ConfigOption, ConfigOption] : [O, ConfigOption] => {
  return [
    ...defineOptionWithPrice(option, priceKey),

    ...(cutOffTimeKey
      ? [
          defineOption({
            group: option.group,
            key: cutOffTimeKey,
            parents: [...(option.parents ?? []), option.key],
            type: OptionType.Time,
          }),
        ]
      : []),
  ];
};

export const ALL_OPTIONS = [
  ...defineOptionWithPrice(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_DELIVERY_OPTIONS,
    },
    PRICE_STANDARD_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_EVENING_DELIVERY,
    },
    PRICE_EVENING_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_MONDAY_DELIVERY,
    },
    PRICE_STANDARD_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_MORNING_DELIVERY,
    },
    PRICE_MORNING_DELIVERY,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.ShipmentOption,
      key: ALLOW_ONLY_RECIPIENT,
    },
    PRICE_ONLY_RECIPIENT,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.PackageType,
      key: ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
    },
    PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.PackageType,
      key: ALLOW_PACKAGE_TYPE_MAILBOX,
    },
    PRICE_PACKAGE_TYPE_MAILBOX,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_PICKUP_LOCATIONS,
    },
    PRICE_PICKUP,
  ),

  ...defineDeliveryOption(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_SAME_DAY_DELIVERY,
    },
    PRICE_SAME_DAY_DELIVERY,
    CUTOFF_TIME_SAME_DAY,
  ),

  ...defineDeliveryOption(
    {
      group: OptionGroup.Delivery,
      key: ALLOW_SATURDAY_DELIVERY,
    },
    PRICE_STANDARD_DELIVERY,
    SATURDAY_CUTOFF_TIME,
  ),

  ...defineOptionWithPrice(
    {
      group: OptionGroup.ShipmentOption,
      key: ALLOW_SIGNATURE,
    },
    PRICE_SIGNATURE,
  ),

  defineOption({
    group: OptionGroup.DropOff,
    key: DROP_OFF_DELAY,
    type: OptionType.Number,
    validators: [rangeValidator(DROP_OFF_DELAY_MIN, DROP_OFF_DELAY_MAX)],
  }),

  defineOption({
    group: OptionGroup.DropOff,
    key: CUTOFF_TIME_SAME_DAY,
    type: OptionType.Time,
  }),

  defineOption({
    group: OptionGroup.Feature,
    key: FEATURE_SHOW_DELIVERY_DATE,
  }),

  defineOption({
    group: OptionGroup.Feature,
    key: FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
    type: OptionType.Select,
  }),

  defineOption({
    group: OptionGroup.Feature,
    key: FEATURE_PICKUP_SHOW_DISTANCE,
  }),

  defineOption({
    group: OptionGroup.Feature,
    key: FEATURE_MAX_PAGE_ITEMS,
    type: OptionType.Number,
  }),
] satisfies ConfigOption[];
