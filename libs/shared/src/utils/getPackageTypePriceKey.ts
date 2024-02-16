import {type SupportedPackageTypeName, type ConfigPriceKey, CarrierSetting} from '@myparcel-do/shared';
import {PackageTypeName} from '@myparcel/constants';

export const getPackageTypePriceKey = (packageType: SupportedPackageTypeName): ConfigPriceKey => {
  switch (packageType) {
    case PackageTypeName.Package:
      return CarrierSetting.PriceStandardDelivery;

    case PackageTypeName.Mailbox:
      return CarrierSetting.PricePackageTypeMailbox;
    case PackageTypeName.DigitalStamp:
      return CarrierSetting.PricePackageTypeDigitalStamp;

    default:
      throw new Error(`Unknown package type: ${packageType}`);
  }
};
