import {computed, ref, type Ref, type ComputedRef} from 'vue';
import {type ResolvedPickupLocation} from '../types';
import {usePickupLocation} from './usePickupLocation';

const selectedPickupLocation = ref();

interface UseSelectedPickupLocation {
  location: ComputedRef<ResolvedPickupLocation | undefined>;
  locationCode: Ref<string | undefined>;
}

export const useSelectedPickupLocation = (): UseSelectedPickupLocation => {
  return {
    locationCode: selectedPickupLocation,
    location: computed(() => {
      if (!selectedPickupLocation.value) {
        return undefined;
      }

      return usePickupLocation(selectedPickupLocation).value;
    }),
  };
};
