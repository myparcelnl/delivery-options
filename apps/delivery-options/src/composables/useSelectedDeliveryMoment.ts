import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type SelectedDeliveryMoment} from '../types';
import {useDeliveryOptionsForm} from '../form';
import {FIELD_DELIVERY_MOMENT} from '../data';

export const useSelectedDeliveryMoment = useMemoize((): ComputedRef<SelectedDeliveryMoment | undefined> => {
  const {instance: form} = useDeliveryOptionsForm();

  return computed(() => {
    const value = form.values?.[FIELD_DELIVERY_MOMENT] ?? undefined;

    return value ? JSON.parse(value) : undefined;
  });
});
