import {computed, type MaybeRef, type ComputedRef} from 'vue';
import {get, useMemoize} from '@vueuse/core';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useResolvedCarrier, type UseResolvedCarrier} from './useResolvedCarrier';

export const getFullPickupLocation = useMemoize((locationCode: string): ResolvedPickupLocation | undefined => {
  const locations = useResolvedPickupLocations();

  return (locations.value ?? []).find((location) => location.locationCode === get(locationCode));
});

type UsePickupLocation = {
  pickupLocation: ComputedRef<ResolvedPickupLocation>;
  resolvedCarrier: ComputedRef<UseResolvedCarrier>;
};

export const usePickupLocation = (locationCode: MaybeRef<string>): UsePickupLocation => {
  const pickupLocation = computed(() => {
    const result = getFullPickupLocation(get(locationCode));

    if (!result) {
      throw new Error(`Pickup location not found: ${get(locationCode)}`);
    }

    return result;
  });

  const resolvedCarrier = computed(() => {
    const carrierIdentifier = pickupLocation.value.carrier;

    return useResolvedCarrier(carrierIdentifier);
  });

  return {
    pickupLocation,
    resolvedCarrier,
  };
};
