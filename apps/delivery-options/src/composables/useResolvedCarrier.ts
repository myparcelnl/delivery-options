import {toValue} from 'vue';
import {type MaybeRef, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier, resolveRefKey, computedAsync, type ComputedAsync} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';

export type UseCarrier = ComputedAsync<ResolvedCarrier | undefined>;

export const useResolvedCarrier = useMemoize(
  (carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>): UseCarrier => {
    const config = useConfigStore();

    return computedAsync(async () => {
      const resolvedCarrierIdentifier = toValue(carrierIdentifier);

      if (!resolvedCarrierIdentifier) {
        return undefined;
      }

      return getResolvedCarrier(resolvedCarrierIdentifier, config.platform);
    });
  },
  {getKey: resolveRefKey},
);
