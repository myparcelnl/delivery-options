import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {usePickupLocationsRequest} from '@myparcel-do/shared';
import {createGetDeliveryOptionsParameters} from '../utils';
import {type ResolvedPickupLocation} from '../types';
import {useActiveCarriers} from './useActiveCarriers';

export const useResolvedPickupLocations = useMemoize(() => {
  const carriers = useActiveCarriers();

  const resolvedOptions = asyncComputed(async () => {
    return Promise.all(
      get(carriers)
        .filter((carrier) => get(carrier.hasPickup))
        .map(async (carrier) => {
          const params = createGetDeliveryOptionsParameters(carrier);
          const query = usePickupLocationsRequest(params);

          await query.load();

          return {
            carrier,
            results: get(query.data) ?? [],
          };
        }),
    );
  });

  return asyncComputed(() => {
    return resolvedOptions.value.reduce((acc, option) => {
      option.results.forEach((dateOption) => {
        acc.push({
          carrier: option.carrier.identifier,
          ...dateOption,
        });
      });

      return acc;
    }, [] as ResolvedPickupLocation[]);
  });
});
