import {type Ref} from 'vue';
import {asyncComputed, get, type MaybeRef, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier, resolveRefKey} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';

export type UseCarrier = Ref<ResolvedCarrier | undefined>;

export const useResolvedCarrier = useMemoize(
  (carrier: MaybeRef<CarrierIdentifier | undefined>): UseCarrier => {
    const config = useConfigStore();

    return asyncComputed(async () => {
      const carrierIdentifier = get(carrier);

      if (!carrierIdentifier) {
        return undefined;
      }

      return getResolvedCarrier(carrierIdentifier, config.platform);
    });
  },
  {getKey: resolveRefKey},
);
