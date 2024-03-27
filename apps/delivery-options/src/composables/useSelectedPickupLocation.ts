import {type Ref, type ComputedRef, computed} from 'vue';
import {type ResolvedPickupLocation} from '../types';
import {useSelectedValues} from './useSelectedValues';
import {usePickupLocation} from './usePickupLocation';

interface UseSelectedPickupLocation {
  location: ComputedRef<ResolvedPickupLocation | undefined>;
  locationCode: Ref<string | undefined>;
}

export const useSelectedPickupLocation = (): UseSelectedPickupLocation => {
  const {pickupLocation: locationCode} = useSelectedValues();

  const pickupLocation = computed(() => {
    if (!locationCode.value) {
      return undefined;
    }

    const {pickupLocation: result} = usePickupLocation(locationCode.value);

    return result.value;
  });

  return {
    location: pickupLocation,
    locationCode,
  };
};
