import {useMemoize} from '@vueuse/core';
import {CarrierSetting, type ConfigOption, getAllConfigOptions} from '@myparcel-do/shared';

const extended = Object.freeze([
  /* Delivery */
  {key: CarrierSetting.AllowDeliveryOptions},

  {key: CarrierSetting.AllowStandardDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceStandardDelivery, parents: [CarrierSetting.AllowStandardDelivery]},

  {key: CarrierSetting.AllowSameDayDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceSameDayDelivery, parents: [CarrierSetting.AllowSameDayDelivery]},

  {key: CarrierSetting.AllowMorningDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceMorningDelivery, parents: [CarrierSetting.AllowMorningDelivery]},

  {key: CarrierSetting.AllowEveningDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceEveningDelivery, parents: [CarrierSetting.AllowEveningDelivery]},

  {key: CarrierSetting.AllowMondayDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceMondayDelivery, parents: [CarrierSetting.AllowMondayDelivery]},

  {key: CarrierSetting.AllowMondayDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceMondayDelivery, parents: [CarrierSetting.AllowMondayDelivery]},

  {key: CarrierSetting.AllowSaturdayDelivery, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceSaturdayDelivery, parents: [CarrierSetting.AllowSaturdayDelivery]},

  {key: CarrierSetting.AllowSignature, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceSignature, parents: [CarrierSetting.AllowSignature]},

  {key: CarrierSetting.AllowOnlyRecipient, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PriceOnlyRecipient, parents: [CarrierSetting.AllowOnlyRecipient]},

  {key: CarrierSetting.PricePackageTypeMailbox, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PricePackageTypeDigitalStamp, parents: [CarrierSetting.AllowDeliveryOptions]},
  {key: CarrierSetting.PricePackageTypePackageSmall, parents: [CarrierSetting.AllowDeliveryOptions]},

  /* Pickup */
  {key: CarrierSetting.PricePickup, parents: [CarrierSetting.AllowPickupLocations]},
]) satisfies readonly ConfigOption[];

export const getAllSandboxConfigOptions = useMemoize((): ConfigOption[] => {
  const configOptions = getAllConfigOptions();

  return configOptions.map((option) => {
    const extension = extended.find((item) => item.key === option.key);

    if (!extension) {
      return option;
    }

    return {...option, ...extension};
  });
});
