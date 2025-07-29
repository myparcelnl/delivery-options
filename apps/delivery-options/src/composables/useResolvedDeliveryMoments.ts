import {computed, type ComputedRef} from 'vue';
import {type ResolvedDeliveryOptions} from '../types';
import {useSelectedValues} from './useSelectedValues';
import {useResolvedDeliveryOptions} from './useResolvedDeliveryOptions';

/**
 * Composable to filters the resolved delivery options based on the selected delivery date.
 *
 * As a workaround, it also returns all options without a date (most likely "fake" options),
 *  as there is no place for this in the UI if there are other options *with* dates.
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
