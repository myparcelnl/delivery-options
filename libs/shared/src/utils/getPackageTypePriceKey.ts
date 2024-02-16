import {PackageTypeName} from '@myparcel/constants';
import {type ConfigPriceKey, type SupportedPackageTypeName} from '../types';
import {CarrierSetting} from '../data';

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
