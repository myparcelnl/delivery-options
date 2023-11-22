import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {type CarrierIdentifier, type CarrierObject} from '../types';
import {useDeliveryOptionsStore} from '../stores';
import {resolveCarrierName} from './resolveCarrierName';

export const getConfigCarriers = (): ComputedRef<CarrierObject[]> => {
  const store = useDeliveryOptionsStore();

  return computed(() => {
    return Object.keys(store.configuration.config?.carrierSettings ?? {}).map((identifier) => {
      return {
        identifier: identifier as CarrierIdentifier,
        name: resolveCarrierName(identifier as CarrierIdentifier),
      };
    });
  });
};
