import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {type CarrierIdentifier, type CarrierSettings} from '../types';
import {useDeliveryOptionsStore} from '../stores';
import {CARRIER_SETTINGS} from '../data';

export const useCarrierSettings = useMemoize((carrier: CarrierIdentifier): ComputedRef<CarrierSettings | null> => {
  const store = useDeliveryOptionsStore();

  return computed(() => store.configuration?.config?.[CARRIER_SETTINGS]?.[carrier] ?? null);
});
