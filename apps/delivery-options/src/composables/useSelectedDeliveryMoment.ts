import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type SelectedDeliveryMoment} from '../types';
import {useSelectedValues} from './useSelectedValues';

export const useSelectedDeliveryMoment = useMemoize((): ComputedRef<SelectedDeliveryMoment | undefined> => {
  const {deliveryMoment} = useSelectedValues();

  return computed(() => {
    const moment = deliveryMoment.value;

    return moment ? JSON.parse(moment) : undefined;
  });
});
