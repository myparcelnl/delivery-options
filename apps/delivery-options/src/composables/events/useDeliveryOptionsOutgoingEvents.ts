import {onUnmounted, watch} from 'vue';
import {isDef} from '@vueuse/core';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS} from '../../data';
import {useResolvedValues} from './useResolvedValues';

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();

  const unwatch = watch(
    resolvedValues,
    (values) => {
      if (!isDef(values)) {
        return;
      }

      emit('update', values);
      document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
    },
    {deep: true, immediate: true},
  );

  onUnmounted(unwatch);
};
