import {computed, type ComputedRef} from 'vue';
import {type ResolvedDeliveryOptions} from '../types';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

export const useResolvedDeliveryDates = (): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();

  return computed(() => {
    if (!deliveryOptions.value) {
      return [];
    }

    return deliveryOptions.value.reduce((acc, option) => {
      if (!acc.some((item) => item.date === option.date)) {
        acc.push(option);
      }

      return acc;
    }, [] as ResolvedDeliveryOptions[]);
  });
};
