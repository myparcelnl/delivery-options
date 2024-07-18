import {type Ref, type ComputedRef} from 'vue';
import {type ResolvedPickupLocation} from '../types';
import {useSelectedValues} from './useSelectedValues';
import {usePickupLocation} from './usePickupLocation';

interface UseSelectedPickupLocation {
  location: ComputedRef<ResolvedPickupLocation | undefined>;
  locationCode: Ref<string | undefined>;
}

export const useSelectedPickupLocation = (): UseSelectedPickupLocation => {
  const {pickupLocation: locationCode} = useSelectedValues();
  const {pickupLocation} = usePickupLocation(locationCode);

  return {
    location: pickupLocation,
    locationCode,
  };
};
