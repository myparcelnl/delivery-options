import {computed, type ComputedRef} from 'vue';
import {useForm} from '@myparcel/vue-form-builder';
import {FIELD_DELIVERY_DATE} from '../constants';

export const useSelectedDeliveryDate = (): ComputedRef<string | undefined> => {
  const form = useForm();

  return computed(() => form.getValues()?.[FIELD_DELIVERY_DATE] as string | undefined);
};
