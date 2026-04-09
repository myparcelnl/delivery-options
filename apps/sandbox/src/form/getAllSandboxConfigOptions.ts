import {CarrierSetting, type ConfigOption, getAllConfigOptions} from '@myparcel-dev/do-shared';

export type SandboxConfigOption = ConfigOption & {
  parents?: string[];
  storePath?: string;
};

const extended = Object.freeze([
  /* Delivery */
  {key: CarrierSetting.AllowStandardDelivery},
  {key: CarrierSetting.PriceStandardDelivery, parents: [CarrierSetting.AllowStandardDelivery]},

  {key: CarrierSetting.AllowSameDayDelivery},
  {key: CarrierSetting.PriceSameDayDelivery, parents: [CarrierSetting.AllowSameDayDelivery]},

  {key: CarrierSetting.AllowExpressDelivery},
  {key: CarrierSetting.PriceExpressDelivery, parents: [CarrierSetting.AllowExpressDelivery]},

  {key: CarrierSetting.AllowMorningDelivery},
  {key: CarrierSetting.PriceMorningDelivery, parents: [CarrierSetting.AllowMorningDelivery]},

  {key: CarrierSetting.AllowEveningDelivery},
  {key: CarrierSetting.PriceEveningDelivery, parents: [CarrierSetting.AllowEveningDelivery]},

  {key: CarrierSetting.AllowMondayDelivery},
  {key: CarrierSetting.PriceMondayDelivery, parents: [CarrierSetting.AllowMondayDelivery]},

  {key: CarrierSetting.AllowSaturdayDelivery},
  {key: CarrierSetting.PriceSaturdayDelivery, parents: [CarrierSetting.AllowSaturdayDelivery]},

  {key: CarrierSetting.AllowSignature},
  {key: CarrierSetting.PriceSignature, parents: [CarrierSetting.AllowSignature]},

  {key: CarrierSetting.AllowOnlyRecipient},
  {key: CarrierSetting.PriceOnlyRecipient, parents: [CarrierSetting.AllowOnlyRecipient]},

  {key: CarrierSetting.PricePackageTypeMailbox, parents: []},
  {key: CarrierSetting.PricePackageTypeDigitalStamp, parents: []},
  {key: CarrierSetting.PricePackageTypePackageSmall, parents: []},

  /* Pickup */
  {key: CarrierSetting.PricePickup, parents: [CarrierSetting.AllowPickupLocations]},
]) satisfies readonly SandboxConfigOption[];

export const getAllSandboxConfigOptions = (): SandboxConfigOption[] => {
  const configOptions = getAllConfigOptions();

  return configOptions.map((option) => {
    const extension = extended.find((item) => item.key === option.key);

    if (!extension) {
      return option;
    }

    return {...option, ...extension};
  });
};
