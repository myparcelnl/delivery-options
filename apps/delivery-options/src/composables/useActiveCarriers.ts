import {type Ref} from 'vue';
import {asyncComputed, useMemoize} from '@vueuse/core';
import {useConfigCarriers} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';

/**
 * Get the carriers that are currently active in the delivery options config.
 */
export const useActiveCarriers = useMemoize((): Ref<ResolvedCarrier[]> => {
  const configCarriers = useConfigCarriers();

  return asyncComputed(async () => {
    return Promise.all(configCarriers.value.map((carrier) => getResolvedCarrier(carrier.identifier)));
  });
});
