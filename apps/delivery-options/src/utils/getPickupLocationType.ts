import {PickupLocationType} from '@myparcel-do/shared';
import {type ResolvedPickupLocation} from '../types';

export const getPickupLocationType = (pickupLocation: ResolvedPickupLocation): PickupLocationType => {
  return pickupLocation.address.number_suffix === 'PBA' ? PickupLocationType.Locker : PickupLocationType.Default;
};
