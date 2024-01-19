import {computed, type MaybeRef} from 'vue';
import {get, useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';

export const getFullPickupLocation = useMemoize((locationCode: string): ResolvedPickupLocation | undefined => {
  const locations = useResolvedPickupLocations();

  return (locations.value ?? []).find((location) => location.locationCode === get(locationCode));
});

export const usePickupLocation = (locationCode: MaybeRef<string>): ComputedRef<ResolvedPickupLocation> => {
  return computed(() => {
    const result = getFullPickupLocation(get(locationCode));

    if (!result) {
      throw new Error(`Pickup location not found: ${get(locationCode)}`);
    }

    return result;
  });
};
