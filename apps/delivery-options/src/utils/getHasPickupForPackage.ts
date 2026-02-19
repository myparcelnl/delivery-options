import {toValue} from 'vue';
import {type PackageTypeName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier} from '../composables';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getHasPickupForPackage = (carrier: UseResolvedCarrier, packageTypeName: PackageTypeName): boolean => {
  return toValue(carrier.hasPickup);
};
