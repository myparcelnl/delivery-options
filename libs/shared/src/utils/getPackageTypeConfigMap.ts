import {PackageTypeName} from '@myparcel/constants';
import {type SupportedPackageTypeName} from '../types';
import {CarrierSetting} from '../enums';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getPackageTypeConfigMap = () => {
  return {
    [PackageTypeName.Package]: CarrierSetting.AllowDeliveryOptions,
    [PackageTypeName.Mailbox]: CarrierSetting.AllowPackageTypeMailbox,
    [PackageTypeName.DigitalStamp]: CarrierSetting.AllowPackageTypeDigitalStamp,
  } satisfies Record<SupportedPackageTypeName, CarrierSetting>;
};
