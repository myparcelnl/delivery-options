import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {usePickupLocationsRequest} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters} from '../utils';
import {type ResolvedPickupLocation} from '../types';
import {useActiveCarriers} from './useActiveCarriers';

export const useResolvedPickupLocations = useMemoize(() => {
  const carriers = useActiveCarriers();

  return asyncComputed<ResolvedPickupLocation[]>(async () => {
    const result = await Promise.all(
      get(carriers)
        .filter((carrier) => get(carrier.hasPickup))
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = usePickupLocationsRequest(params);

          await query.load();

          return (get(query.data) ?? []).map((option) => ({
            ...option,
            carrier: carrier.identifier,
          }));
        }),
    );

    return result
      .flat(1)
      .sort((a, b) => Number(a.location.distance) - Number(b.location.distance)) as ResolvedPickupLocation[];
  });
});
