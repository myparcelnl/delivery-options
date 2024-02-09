import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ResolvedDeliveryOptions} from '../types';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

export const useResolvedDeliveryDates = useMemoize((): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();

  return computed(() => {
    if (deliveryOptions.loading.value) {
      return [];
    }

    return deliveryOptions.value.reduce((acc, option) => {
      if (!acc.some((item) => item.date === option.date)) {
        acc.push(option);
      }

      return acc;
    }, [] as ResolvedDeliveryOptions[]);
  });
});
