import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {resolveCarrierName} from '../utils';
import {type CarrierIdentifier, type CarrierObject} from '../types';
import {useDeliveryOptionsStore} from '../stores';

export const useConfigCarriers = useMemoize((): ComputedRef<CarrierObject[]> => {
  const store = useDeliveryOptionsStore();

  return computed(() => {
    return Object.keys(store.configuration.config?.carrierSettings ?? {}).map((identifier) => {
      return {
        identifier: identifier as CarrierIdentifier,
        name: resolveCarrierName(identifier as CarrierIdentifier),
      };
    });
  });
});
