import type {CarrierIdentifier} from '@myparcel-do/shared';
import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {get} from '@vueuse/core';
import {CarrierName} from '@myparcel/constants';
import {type ResolvedPickupLocation} from '../types';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';
import {useResolvedCarrier, type UseResolvedCarrier} from './useResolvedCarrier';

interface UsePickupLocation {
  pickupLocation: ComputedRef<ResolvedPickupLocation | undefined>;
  resolvedCarrier: ComputedRef<UseResolvedCarrier | undefined>;
}

let counter = 1;

export const usePickupLocation = (
  locationCode: MaybeRef<string | undefined>,
  selectedCarrier: MaybeRef<CarrierIdentifier | undefined>,
): UsePickupLocation => {
  console.log(counter, 'usePickupLocation called');
  counter++;

  if (get(selectedCarrier) === CarrierName.UpsStandard) {
    console.log(get(selectedCarrier), '===============');
  }

  console.log(locationCode, 'locationCode');
  console.log(selectedCarrier, 'selectedCarrier');
  const {locations} = useResolvedPickupLocations();

  const pickupLocation = computed(() => {
    const code = get(locationCode);
    const carrier = get(selectedCarrier);
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
