import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type CarrierIdentifier, type CarrierSettings} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

export const useCarrierSettings = useMemoize(
  (carrierIdentifier: CarrierIdentifier): ComputedRef<CarrierSettings | null> => {
    const store = useConfigStore();

    return computed(() => store.carrierSettings[carrierIdentifier] ?? null);
  },
);
