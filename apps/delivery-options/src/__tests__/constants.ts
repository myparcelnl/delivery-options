// noinspection ShiftOutOfRangeJS

import {CarrierSetting} from '@myparcel-dev/shared';
import {CarrierName} from '@myparcel-dev/constants';

export const MOCK_DEFAULT_DATE = '2021-01-01 00:00:00';

/**
 * Bitmask values for all combinations of delivery options.
 */
export enum TestValue {
  Default = 0,

  // Package Types
  PackageTypeMailbox = 1 << 0,
  PackageTypeDigitalStamp = 1 << 1,
  PackageTypePackageSmall = 1 << 2,

  // Delivery Types
  DeliveryTypeMorning = 1 << 3,
  DeliveryTypeEvening = 1 << 4,
  DeliveryTypeMonday = 1 << 5,
  DeliveryTypeSaturday = 1 << 6,
  DeliveryTypeSameDay = 1 << 7,
  DeliveryTypePickup = 1 << 8,
  DeliveryTypeExpress = 1 << 9,

  // Carriers
  CarrierPostNl = 1 << 20,
  CarrierBpost = 1 << 21,
  // CarrierCheapCargo = 1 << 22, (not used)
  CarrierDpd = 1 << 23,
  // CarrierInstabox = 1 << 24, (not used)
  CarrierDhl = 1 << 25,
  // CarrierBol = 1 << 26, (not used)
  CarrierUps = 1 << 27,
  CarrierDhlForYou = 1 << 28,
  CarrierDhlParcelConnect = 1 << 29,
  CarrierDhlEuroPlus = 1 << 30,
  CarrierUpsStandard = 1 << 31,
  CarrierUpsExpressSaver = 1 << 32,
  CarrierGls = 1 << 33,
  CarrierTrunkrs = 1 << 34,

  // Shipment options
  ShipmentOptionSignature = 1 << 40,
  ShipmentOptionOnlyRecipient = 1 << 41,

  // Custom Contracts
  CustomContract1 = 1 << 50,
  CustomContract2 = 1 << 51,
}

export const TEST_VALUE_MAP_CARRIERS = Object.freeze({
  [CarrierName.PostNl]: TestValue.CarrierPostNl,
  [CarrierName.Bpost]: TestValue.CarrierBpost,
  [CarrierName.Dpd]: TestValue.CarrierDpd,
  [CarrierName.Dhl]: TestValue.CarrierDhl,
  [CarrierName.Ups]: TestValue.CarrierUps,
  [CarrierName.UpsStandard]: TestValue.CarrierUpsStandard,
  [CarrierName.UpsExpressSaver]: TestValue.CarrierUpsExpressSaver,
  [CarrierName.DhlForYou]: TestValue.CarrierDhlForYou,
  [CarrierName.DhlParcelConnect]: TestValue.CarrierDhlParcelConnect,
  [CarrierName.DhlEuroPlus]: TestValue.CarrierDhlEuroPlus,
  [CarrierName.Gls]: TestValue.CarrierGls,
  [CarrierName.Trunkrs]: TestValue.CarrierTrunkrs,
});

export const TEST_VALUE_MAP_CUSTOM_CONTRACTS = Object.freeze({
  0: 0,
  1: TestValue.CustomContract1,
  2: TestValue.CustomContract2,
});

export const TEST_VALUE_MAP_PRICES = Object.freeze({
  [CarrierSetting.PriceEveningDelivery]: TestValue.DeliveryTypeEvening,
  [CarrierSetting.PriceMondayDelivery]: TestValue.DeliveryTypeMonday,
  [CarrierSetting.PriceMorningDelivery]: TestValue.DeliveryTypeMorning,
  [CarrierSetting.PriceOnlyRecipient]: TestValue.ShipmentOptionOnlyRecipient,
  [CarrierSetting.PricePackageTypeDigitalStamp]: TestValue.PackageTypeDigitalStamp,
  [CarrierSetting.PricePackageTypeMailbox]: TestValue.PackageTypeMailbox,
  [CarrierSetting.PricePackageTypePackageSmall]: TestValue.PackageTypePackageSmall,
  [CarrierSetting.PricePickup]: TestValue.DeliveryTypePickup,
  [CarrierSetting.PriceSameDayDelivery]: TestValue.DeliveryTypeSameDay,
  [CarrierSetting.PriceSaturdayDelivery]: TestValue.DeliveryTypeSaturday,
  [CarrierSetting.PriceSignature]: TestValue.ShipmentOptionSignature,
  [CarrierSetting.PriceStandardDelivery]: TestValue.Default,
  [CarrierSetting.PriceExpressDelivery]: TestValue.DeliveryTypeExpress,
});
