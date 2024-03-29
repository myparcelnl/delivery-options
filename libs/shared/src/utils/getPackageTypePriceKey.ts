import {PackageTypeName} from '@myparcel/constants';
import {type ConfigPriceKey, type SupportedPackageTypeName} from '../types';
import {CarrierSetting} from '../data';

const map = Object.freeze({
  [PackageTypeName.Package]: CarrierSetting.PriceStandardDelivery,
  [PackageTypeName.Mailbox]: CarrierSetting.PricePackageTypeMailbox,
  [PackageTypeName.DigitalStamp]: CarrierSetting.PricePackageTypeDigitalStamp,
  [PackageTypeName.PackageSmall]: CarrierSetting.PricePackageTypePackageSmall,
} satisfies Record<SupportedPackageTypeName, CarrierSetting>);

export const getPackageTypePriceKey = (packageType: SupportedPackageTypeName): ConfigPriceKey => map[packageType];
