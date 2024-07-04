import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {get} from '@vueuse/core';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useResolvedCarrier, type UseResolvedCarrier} from './useResolvedCarrier';

interface UsePickupLocation {
  pickupLocation: ComputedRef<ResolvedPickupLocation | undefined>;
  resolvedCarrier: ComputedRef<UseResolvedCarrier | undefined>;
}

export const usePickupLocation = (locationCode: MaybeRef<string | undefined>): UsePickupLocation => {
  const {locations} = useResolvedPickupLocations();

  const pickupLocation = computed(() => {
    return toValue(locations).find((location) => location.locationCode === get(locationCode));
  });

  const resolvedCarrier = computed(() => {
    const carrierIdentifier = toValue(pickupLocation)?.carrier;

    if (carrierIdentifier) {
      return useResolvedCarrier(carrierIdentifier);
    }

    return undefined;
  });

  return {
    pickupLocation,
    resolvedCarrier,
  };
};
