import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ResolvedDeliveryOptions} from '../types';
import {useConfigStore} from '../stores';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';
import {useFeatures} from './useFeatures';

export const useResolvedDeliveryDates = useMemoize((): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryOptions = useResolvedDeliveryOptions();
  const config = useConfigStore();
  const {showDeliveryDate} = useFeatures();

  return computed(() => {
    if (!showDeliveryDate.value || deliveryOptions.loading.value) {
      return [];
    }

    return deliveryOptions.value
      .filter((option) => option.packageType === config.packageType)
      .reduce((acc, option) => {
        if (option.date && !acc.some((item) => item.date === option.date)) {
          acc.push(option as ResolvedDeliveryOptions);
        }

        return acc;
      }, [] as ResolvedDeliveryOptions[])
      .sort((itemA, itemB) => {
        if (itemA.date && itemB.date) {
          return itemA.date.localeCompare(itemB.date);
        }

        return 0;
      });
  });
});
