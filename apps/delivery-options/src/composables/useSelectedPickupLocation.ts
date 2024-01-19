import {computed, ref, type Ref} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {type ResolvedPickupLocation} from '../types';
import {usePickupLocation} from './usePickupLocation';

const selectedPickupLocation = ref();

export const useSelectedPickupLocation = (): {
  locationCode: Ref<string>;
  location: ComputedRef<ResolvedPickupLocation | undefined>;
} => {
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
