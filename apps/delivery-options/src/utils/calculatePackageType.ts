import {type SupportedPackageTypeName, CarrierSetting, PACKAGE_TYPE_DEFAULT} from '@myparcel-dev/shared';
import {CarrierName, PackageTypeName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier} from '../composables';
import {getResolvedValue} from './getResolvedValue';

export const calculatePackageType = ({
  carrier,
  packageTypes,
}: UseResolvedCarrier): SupportedPackageTypeName | undefined => {
  // TODO: Remove this when the API supports package type package in platform myparcel
  if (CarrierName.Dpd === carrier.value.name) {
    return undefined;
  }

  const packageType: SupportedPackageTypeName = getResolvedValue(
    CarrierSetting.PackageType,
    carrier.value.identifier,
    PackageTypeName.Package,
  );

  return packageTypes.value.has(packageType) ? packageType : PACKAGE_TYPE_DEFAULT;
};
