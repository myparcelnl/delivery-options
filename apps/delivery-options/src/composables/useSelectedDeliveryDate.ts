import {computed, type ComputedRef} from 'vue';
import {useForm} from '@myparcel/vue-form-builder';

export const useSelectedDeliveryDate = (): ComputedRef<string | undefined> => {
  const form = useForm();

  return computed(() => form.getValues()?.deliveryDate as string | undefined);
};
