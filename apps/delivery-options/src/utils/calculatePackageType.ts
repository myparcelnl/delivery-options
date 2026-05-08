import {type SupportedPackageTypeName, CarrierSetting, PACKAGE_TYPE_DEFAULT} from '@myparcel-dev/do-shared';
import {PackageTypeName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier} from '../composables';
import {getResolvedValue} from './getResolvedValue';

export const calculatePackageType = ({
  carrier,
  packageTypes,
}: UseResolvedCarrier): SupportedPackageTypeName | undefined => {
  const packageType: SupportedPackageTypeName = getResolvedValue(
    CarrierSetting.PackageType,
    carrier.value.identifier,
    PackageTypeName.Package,
  );

  return packageTypes.value.has(packageType) ? packageType : PACKAGE_TYPE_DEFAULT;
};
