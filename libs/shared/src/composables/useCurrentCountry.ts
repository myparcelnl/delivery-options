import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {useDeliveryOptionsStore} from '../stores';

export const useCurrentCountry = (): ComputedRef<string> => {
  const store = useDeliveryOptionsStore();

  return computed(() => store.configuration.address.cc);
};
