import {PackageTypeName} from '@myparcel-dev/constants';
import {type ConfigPriceKey, type SupportedPackageTypeName} from '../types';
// Import directly from enum source to avoid circular dependency through barrel.
import {CarrierSetting} from '../data/enums';

const map = Object.freeze({
  [PackageTypeName.Package]: CarrierSetting.PriceStandardDelivery,
  [PackageTypeName.Mailbox]: CarrierSetting.PricePackageTypeMailbox,
  [PackageTypeName.DigitalStamp]: CarrierSetting.PricePackageTypeDigitalStamp,
  [PackageTypeName.PackageSmall]: CarrierSetting.PricePackageTypePackageSmall,
  [PackageTypeName.Envelope]: CarrierSetting.PricePackageTypeEnvelope,
} satisfies Record<SupportedPackageTypeName, CarrierSetting>);

export const getPackageTypePriceKey = (packageType: SupportedPackageTypeName): ConfigPriceKey => map[packageType];
