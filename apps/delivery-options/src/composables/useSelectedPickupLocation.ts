import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useDeliveryOptionsForm} from '../form';
import {FIELD_PICKUP_LOCATION} from '../data';

export const useSelectedPickupLocation = useMemoize(() => {
  const form = useDeliveryOptionsForm();

  const model = computed<string | undefined>({
    get() {
      return form.getValue(FIELD_PICKUP_LOCATION);
    },

    set(val) {
      form.setValue(FIELD_PICKUP_LOCATION, val);
    },
  });

  return {model};
});
