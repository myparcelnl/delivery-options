import {computed, type MaybeRef, type ComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useResolvedCarrier, type UseResolvedCarrier} from './useResolvedCarrier';

export const getFullPickupLocation = (locationCode: string): ResolvedPickupLocation | undefined => {
  const locations = useResolvedPickupLocations();

  return (locations.value ?? []).find((location) => location.locationCode === get(locationCode));
};

type UsePickupLocation = {
  pickupLocation: ComputedRef<ResolvedPickupLocation | undefined>;
  resolvedCarrier: ComputedRef<UseResolvedCarrier | undefined>;
};

export const usePickupLocation = (locationCode: MaybeRef<string>): UsePickupLocation => {
  const pickupLocation = computed(() => {
    return getFullPickupLocation(get(locationCode));
  });

  const resolvedCarrier = computed(() => {
    const carrierIdentifier = pickupLocation.value?.carrier;

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
