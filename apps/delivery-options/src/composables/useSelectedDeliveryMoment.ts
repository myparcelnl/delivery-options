import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useForm} from '@myparcel/vue-form-builder';
import {type SelectedDeliveryMoment} from '../types';
import {FIELD_DELIVERY_MOMENT} from '../data';

export const useSelectedDeliveryMoment = useMemoize((): ComputedRef<SelectedDeliveryMoment | undefined> => {
  const form = useForm();

  return computed(() => {
    const value = form.values?.[FIELD_DELIVERY_MOMENT] ?? undefined;

    return value ? JSON.parse(value) : undefined;
  });
});
