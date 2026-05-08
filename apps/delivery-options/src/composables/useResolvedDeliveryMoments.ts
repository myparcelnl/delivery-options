import {computed, type ComputedRef} from 'vue';
import {type ResolvedDeliveryOptions} from '../types';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

/**
 * Composable that filters the resolved delivery options based on the selected delivery date.
 *
 * @returns ComputedRef of ResolvedDeliveryOptions[]
 */
export const useResolvedDeliveryMoments = (): ComputedRef<ResolvedDeliveryOptions[]> => {
  const {deliveryDate} = useSelectedValues();
  const deliveryOptions = useResolvedDeliveryOptions();

  return computed(() => {
    if (deliveryOptions.loading.value) {
      return [];
    }

    return deliveryOptions.value.filter((option) => option.date === deliveryDate.value || !option.date);
  });
};
