import {computed, type ComputedRef} from 'vue';
import {useForm} from '@myparcel/vue-form-builder';
import {FIELD_DELIVERY_DATE} from '../data';

export const useSelectedDeliveryDate = (): ComputedRef<string | undefined> => {
  const form = useForm();

  return computed(() => form.values[FIELD_DELIVERY_DATE] ?? undefined);
};
