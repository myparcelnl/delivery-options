import {computed, type Ref} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {type ResolvedPickupLocation} from '../types';
import {useSelectedPickupLocation} from './useSelectedPickupLocation';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';

export const useSelectedFullLocation = (): {
  locationCode: Ref<string>;
  location: ComputedRef<ResolvedPickupLocation | undefined>;
} => {
  const {model} = useSelectedPickupLocation();

  const locations = useResolvedPickupLocations();

  return {
    locationCode: model,
    location: computed(() => {
      return locations.value?.find(({location}) => location.location_code === model.value);
    }),
  };
};
