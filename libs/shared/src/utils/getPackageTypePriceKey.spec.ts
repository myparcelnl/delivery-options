import {describe, it, expect} from 'vitest';
import {PackageTypeName} from '@myparcel-dev/constants';
import {type SupportedPackageTypeName} from '../types';
import {CarrierSetting} from '../data';
import {getPackageTypePriceKey} from './getPackageTypePriceKey';

describe('getPackageTypePriceKey', () => {
  it.each([
    [PackageTypeName.Package, CarrierSetting.PriceStandardDelivery],
    [PackageTypeName.Mailbox, CarrierSetting.PricePackageTypeMailbox],
    [PackageTypeName.DigitalStamp, CarrierSetting.PricePackageTypeDigitalStamp],
    [PackageTypeName.PackageSmall, CarrierSetting.PricePackageTypePackageSmall],
  ] satisfies [SupportedPackageTypeName, CarrierSetting][])(
    'returns the correct price key for %s',
    (packageType, expected) => {
      expect(getPackageTypePriceKey(packageType)).toBe(expected);
    },
  );
});
