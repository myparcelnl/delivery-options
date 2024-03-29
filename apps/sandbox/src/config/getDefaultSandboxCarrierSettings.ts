/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  type CarrierSettingsObject,
  getDefaultCarrierSettings,
  CarrierSetting,
  SUPPORTED_PLATFORMS,
  getPlatformConfig,
} from '@myparcel-do/shared';

const numberBetween = (min: number, max: number): number => {
  const number = Math.random() * (max - min) + min;

  return Number(number.toFixed(2));
};

export const getDefaultSandboxCarrierSettings = (): CarrierSettingsObject => {
  const defaultCarrierSettings = getDefaultCarrierSettings();

  const allSupportedCarriers = SUPPORTED_PLATFORMS.map((platform) => getPlatformConfig(platform).carriers)
    .flat()
    .map((carrier) => carrier.name);

  return Object.fromEntries(
    allSupportedCarriers.map((carrier) => [
      carrier,
      {
        ...defaultCarrierSettings,
        [CarrierSetting.PricePickup]: numberBetween(-2, 0),
        [CarrierSetting.AllowDeliveryOptions]: true,
        [CarrierSetting.AllowStandardDelivery]: true,
        [CarrierSetting.PriceStandardDelivery]: numberBetween(5, 7),
        [CarrierSetting.AllowMorningDelivery]: true,
        [CarrierSetting.PriceMorningDelivery]: numberBetween(7, 10),
        [CarrierSetting.AllowEveningDelivery]: true,
        [CarrierSetting.PriceEveningDelivery]: numberBetween(7, 9),
        [CarrierSetting.AllowSameDayDelivery]: true,
        [CarrierSetting.PriceSameDayDelivery]: numberBetween(8, 12),
        [CarrierSetting.AllowMondayDelivery]: true,
        [CarrierSetting.PriceMondayDelivery]: numberBetween(6, 8),
        [CarrierSetting.AllowSaturdayDelivery]: true,
        [CarrierSetting.PriceSaturdayDelivery]: numberBetween(6, 8),
        [CarrierSetting.PricePackageTypeDigitalStamp]: numberBetween(1, 3.5),
        [CarrierSetting.PricePackageTypeMailbox]: numberBetween(3, 5),
        [CarrierSetting.PricePackageTypePackageSmall]: numberBetween(2, 4),
        [CarrierSetting.AllowOnlyRecipient]: true,
        [CarrierSetting.PriceOnlyRecipient]: numberBetween(0.1, 0.9),
        [CarrierSetting.AllowSignature]: true,
        [CarrierSetting.PriceSignature]: numberBetween(0.1, 0.9),
        [CarrierSetting.AllowPickupLocations]: true,
      },
    ]),
  );
};
