import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ResolvedDeliveryOptions} from '../types';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useFeatures} from './useFeatures';

export const useResolvedDeliveryDates = useMemoize((): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();
  const {showDeliveryDate} = useFeatures();

  return computed(() => {
    if (!showDeliveryDate.value || deliveryOptions.loading.value) {
      return [];
    }

    return deliveryOptions.value.reduce((acc, option) => {
      if (option.date && !acc.some((item) => item.date === option.date)) {
        acc.push(option as ResolvedDeliveryOptions);
      }

      return acc;
    }, [] as ResolvedDeliveryOptions[]);
  });
});
