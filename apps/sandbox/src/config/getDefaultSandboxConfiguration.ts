/* eslint-disable @typescript-eslint/no-magic-numbers */
import {assign} from 'radash';
import {
  CarrierSetting,
  type CarrierSettingsObject,
  type DeliveryOptionsAddress,
  DROP_OFF_CUTOFF_TIME,
  DROP_OFF_SAME_DAY_CUTOFF_TIME,
  DROP_OFF_WEEKDAY,
  getDefaultDeliveryOptionsConfig,
  type InputDeliveryOptionsConfig,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';

export const getDefaultSandboxConfig = (): InputDeliveryOptionsConfig => {
  const defaults = getDefaultDeliveryOptionsConfig();

  return assign<InputDeliveryOptionsConfig>(defaults, {
    [CarrierSetting.DropOffDelay]: 1,
    [CarrierSetting.DeliveryDaysWindow]: 7,
    [CarrierSetting.DropOffDays]: [
      {
        [DROP_OFF_WEEKDAY]: 2,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 3,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 4,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
      {
        [DROP_OFF_WEEKDAY]: 5,
        [DROP_OFF_CUTOFF_TIME]: '17:00',
        [DROP_OFF_SAME_DAY_CUTOFF_TIME]: '09:30',
      },
    ],
  });
};

export const getDefaultSandboxCarrierSettings = (): CarrierSettingsObject => {
  return {
    [CarrierName.PostNl]: {
      [CarrierSetting.PricePickup]: -1,
      [CarrierSetting.AllowDeliveryOptions]: true,
      [CarrierSetting.PriceStandardDelivery]: 5.95,
      [CarrierSetting.AllowMorningDelivery]: true,
      [CarrierSetting.PriceMorningDelivery]: 4,
      [CarrierSetting.AllowEveningDelivery]: true,
      [CarrierSetting.PriceEveningDelivery]: 5,
      [CarrierSetting.AllowSameDayDelivery]: true,
      [CarrierSetting.PriceSameDayDelivery]: 6,
      [CarrierSetting.AllowMondayDelivery]: true,
      [CarrierSetting.PriceMondayDelivery]: 7,
      [CarrierSetting.AllowSaturdayDelivery]: true,
      [CarrierSetting.PriceSaturdayDelivery]: 8,
      [CarrierSetting.AllowPackageTypeDigitalStamp]: true,
      [CarrierSetting.PricePackageTypeDigitalStamp]: 3.29,
      [CarrierSetting.AllowPackageTypeMailbox]: true,
      [CarrierSetting.PricePackageTypeMailbox]: 3.49,
      [CarrierSetting.AllowOnlyRecipient]: true,
      [CarrierSetting.PriceOnlyRecipient]: 0.59,
      [CarrierSetting.AllowSignature]: true,
      [CarrierSetting.PriceSignature]: 0.49,
      [CarrierSetting.AllowPickupLocations]: true,
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
