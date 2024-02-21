import {
  type CarrierSettingsObject,
  getDefaultCarrierSettings,
  CarrierSetting,
  SUPPORTED_PLATFORMS,
  getPlatformConfig,
} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';

export const getDefaultSandboxCarrierSettings = (): CarrierSettingsObject => {
  const defaultCarrierSettings = getDefaultCarrierSettings();

  const allSupportedCarriers = SUPPORTED_PLATFORMS.map((platform) => getPlatformConfig(platform).carriers)
    .flat()
    .map((carrier) => carrier.name);

  const carrierSettings = Object.fromEntries(allSupportedCarriers.map((carrier) => [carrier, defaultCarrierSettings]));

  return {
    ...carrierSettings,

    [CarrierName.PostNl]: {
      ...defaultCarrierSettings,
      [CarrierSetting.PricePickup]: -1,
      [CarrierSetting.AllowDeliveryOptions]: true,
      [CarrierSetting.AllowStandardDelivery]: true,
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
      [CarrierSetting.PricePackageTypeDigitalStamp]: 3.29,
      [CarrierSetting.PricePackageTypeMailbox]: 3.49,
      [CarrierSetting.AllowOnlyRecipient]: true,
      [CarrierSetting.PriceOnlyRecipient]: 0.59,
      [CarrierSetting.AllowSignature]: true,
      [CarrierSetting.PriceSignature]: 0.49,
      [CarrierSetting.AllowPickupLocations]: true,
    },
  };
};
