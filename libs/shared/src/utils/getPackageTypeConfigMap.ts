import {PackageTypeName} from '@myparcel/constants';
import {type SupportedPackageTypeName} from '../types';
import {type CarrierSetting} from '../enums';
import {ALLOW_DELIVERY_OPTIONS, ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, ALLOW_PACKAGE_TYPE_MAILBOX} from '../data';

export const getPackageTypeConfigMap = (): Record<SupportedPackageTypeName, CarrierSetting> => ({
  [PackageTypeName.Package]: ALLOW_DELIVERY_OPTIONS,
  [PackageTypeName.Mailbox]: ALLOW_PACKAGE_TYPE_MAILBOX,
  [PackageTypeName.DigitalStamp]: ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
});
