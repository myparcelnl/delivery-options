import {computed, type ComputedRef} from 'vue';
import {resolveTranslatable} from '@myparcel-do/shared';
import {type ResolvedDeliveryOptions} from '../types';
import {useSelectedDeliveryDate} from './useSelectedDeliveryDate';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

export const useResolvedDeliveryMoments = (): ComputedRef<ResolvedDeliveryOptions[]> => {
  const deliveryDate = useSelectedDeliveryDate();
  const deliveryOptions = useResolvedDeliveryOptions();

  return computed(() => {
    if (deliveryOptions.loading.value) {
      return [];
    }

    return deliveryOptions.value
      .filter((option) => option.date === deliveryDate.value)
      .sort((optionA, optionB) => {
        return resolveTranslatable(optionA.time).localeCompare(resolveTranslatable(optionB.time));
      });
  });
};
