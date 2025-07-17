import type {CarrierIdentifier} from '@myparcel-do/shared';
import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useResolvedCarrier, type UseResolvedCarrier} from './useResolvedCarrier';

interface UsePickupLocation {
  pickupLocation: ComputedRef<ResolvedPickupLocation | undefined>;
  resolvedCarrier: ComputedRef<UseResolvedCarrier | undefined>;
}

export const usePickupLocation = (
  locationCode: MaybeRef<string | undefined>,
  selectedCarrier: MaybeRef<CarrierIdentifier | undefined>,
): UsePickupLocation => {
  const {locations} = useResolvedPickupLocations();

  const pickupLocation = computed(() => {
    const code = toValue(locationCode);
    const carrier = toValue(selectedCarrier);
    return toValue(locations).find((location) => location.locationCode === code && location.carrier === carrier);
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
