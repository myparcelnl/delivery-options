import {toValue} from 'vue';
import {PACKAGE_TYPE_DEFAULT, PACKAGE_TYPE_SMALL} from '@myparcel-do/shared';
import {type PackageTypeName} from '@myparcel/constants';
import {type UseResolvedCarrier} from '../composables';

export const getHasPickupForPackage = (carrier: UseResolvedCarrier, packageTypeName: PackageTypeName): boolean => {
  let hasPickup = false;

  if (PACKAGE_TYPE_DEFAULT === packageTypeName) {
    hasPickup = toValue(carrier.hasPickup);
  }

  if (PACKAGE_TYPE_SMALL === packageTypeName) {
    hasPickup = toValue(carrier.hasSmallPackagePickup);
  }

  return hasPickup;
};
