import {assign, crush} from 'radash';
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
  CARRIER_SETTINGS,
  CUTOFF_TIME_SAME_DAY,
  DELIVERY_DAYS_WINDOW,
  type DeliveryOptionsAddress,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  getDefaultConfiguration,
  type InputDeliveryOptionsConfiguration,
  KEY_ADDRESS,
  KEY_CONFIG,
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
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

export const getDefaultSandboxConfig = (): Record<string, unknown> => {
  const defaults = getDefaultConfiguration(PlatformName.MyParcel);

  return assign(defaults.config, {
    [DROP_OFF_DELAY]: 1,
    [DELIVERY_DAYS_WINDOW]: 7,
    [CUTOFF_TIME_SAME_DAY]: '09:30',
    [DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
  }) as Record<string, unknown>;
};

export const getDefaultSandboxCarrierSettings = (): Record<string, unknown> => {
  return {
    [CarrierName.PostNl]: {
      [PRICE_PICKUP]: -1,
      [ALLOW_DELIVERY_OPTIONS]: true,
      [PRICE_STANDARD_DELIVERY]: 5.95,
      [ALLOW_MORNING_DELIVERY]: true,
      [PRICE_MORNING_DELIVERY]: 4,
      [ALLOW_EVENING_DELIVERY]: true,
      [PRICE_EVENING_DELIVERY]: 5,
      [ALLOW_SAME_DAY_DELIVERY]: true,
      [PRICE_SAME_DAY_DELIVERY]: 6,
      [ALLOW_MONDAY_DELIVERY]: true,
      [PRICE_MONDAY_DELIVERY]: 7,
      [ALLOW_SATURDAY_DELIVERY]: true,
      [PRICE_SATURDAY_DELIVERY]: 8,
      [ALLOW_PACKAGE_TYPE_DIGITAL_STAMP]: true,
      [PRICE_PACKAGE_TYPE_DIGITAL_STAMP]: 3.29,
      [ALLOW_PACKAGE_TYPE_MAILBOX]: true,
      [PRICE_PACKAGE_TYPE_MAILBOX]: 3.49,
      [ALLOW_ONLY_RECIPIENT]: true,
      [PRICE_ONLY_RECIPIENT]: 0.59,
      [ALLOW_SIGNATURE]: true,
      [PRICE_SIGNATURE]: 0.49,
      [ALLOW_PICKUP_LOCATIONS]: true,
    },
  };
};

export const getDefaultSandboxAddress = (): DeliveryOptionsAddress => {
  return {
    cc: 'NL',
    street: 'Antareslaan 31',
    postalCode: '2132 JE',
    city: 'Hoofddorp',
  };
};

export const getDefaultSandboxConfiguration = (): Record<string, unknown> => {
  const defaults = getDefaultConfiguration(PlatformName.MyParcel);

  const configuration = {
    [KEY_ADDRESS]: {
      cc: 'NL',
      street: 'Antareslaan 31',
      postalCode: '2132 JE',
      city: 'Hoofddorp',
    },

    [KEY_CONFIG]: {
      [DROP_OFF_DELAY]: 1,
      [DELIVERY_DAYS_WINDOW]: 7,
      [CUTOFF_TIME_SAME_DAY]: '09:30',
      [DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
      [CARRIER_SETTINGS]: {
        [CarrierName.PostNl]: {
          [PRICE_PICKUP]: -1,
          [ALLOW_DELIVERY_OPTIONS]: true,
          [PRICE_STANDARD_DELIVERY]: 5.95,
          [ALLOW_MORNING_DELIVERY]: true,
          [PRICE_MORNING_DELIVERY]: 4,
          [ALLOW_EVENING_DELIVERY]: true,
          [PRICE_EVENING_DELIVERY]: 5,
          [ALLOW_SAME_DAY_DELIVERY]: true,
          [PRICE_SAME_DAY_DELIVERY]: 6,
          [ALLOW_MONDAY_DELIVERY]: true,
          [PRICE_MONDAY_DELIVERY]: 7,
          [ALLOW_SATURDAY_DELIVERY]: true,
          [PRICE_SATURDAY_DELIVERY]: 8,
          [ALLOW_PACKAGE_TYPE_DIGITAL_STAMP]: true,
          [PRICE_PACKAGE_TYPE_DIGITAL_STAMP]: 3.29,
          [ALLOW_PACKAGE_TYPE_MAILBOX]: true,
          [PRICE_PACKAGE_TYPE_MAILBOX]: 3.49,
          [ALLOW_ONLY_RECIPIENT]: true,
          [PRICE_ONLY_RECIPIENT]: 0.59,
          [ALLOW_SIGNATURE]: true,
          [PRICE_SIGNATURE]: 0.49,
          [ALLOW_PICKUP_LOCATIONS]: true,
        },
      },
    },
  } satisfies Omit<InputDeliveryOptionsConfiguration, 'components'>;

  return crush(assign(defaults, configuration)) as Record<string, unknown>;
};
