import {computed, type ComputedRef} from 'vue';
import {useSelectedDeliveryDate} from './useSelectedDeliveryDate';
import {type ResolvedDeliveryOptions, useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

export const useResolvedDeliveryMoments = (): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryDate = useSelectedDeliveryDate();
  const deliveryOptions = useResolvedDeliveryOptions();

  return computed(() => {
    if (!deliveryDate.value || !deliveryOptions.value) {
      return [];
    }

    return deliveryOptions.value
      .filter((option) => option.date === deliveryDate.value)
      .sort((a, b) => a.time.localeCompare(b.time));
  });
};
