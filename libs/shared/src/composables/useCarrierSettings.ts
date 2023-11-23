import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {
  CARRIER_SETTINGS,
  type CarrierIdentifier,
  type CarrierSettings,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';

export const useCarrierSettings = useMemoize((carrier: CarrierIdentifier): ComputedRef<CarrierSettings | null> => {
  const store = useDeliveryOptionsStore();

  return computed(() => store.configuration?.config?.[CARRIER_SETTINGS]?.[carrier] ?? null);
});
