import {onUnmounted, watch} from 'vue';
import {useDebounceFn, isDef} from '@vueuse/core';
import {subscribeToExceptions, type PickupOutput} from '@myparcel-dev/shared';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS, OUTPUT_EVENT_DEBOUNCE_DELAY, ERROR_DELIVERY_OPTIONS} from '../../data';
import {useResolvedValues} from './useResolvedValues';

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();

  const emitUpdate = useDebounceFn((values, oldValues: PickupOutput) => {
    if (!isDef(values) && !isDef(oldValues)) {
      return;
    }

    emit('update', values);
    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  }, OUTPUT_EVENT_DEBOUNCE_DELAY);

  const unwatchResolvedValues = watch(resolvedValues, emitUpdate, {deep: true, immediate: true});
  
  // Subscribe to exception events
  const unsubscribe = subscribeToExceptions((exception) => {
    document.dispatchEvent(
      new CustomEvent(ERROR_DELIVERY_OPTIONS, {
        detail: {exception},
      }),
    );
  });

  onUnmounted(() => {
    unwatchResolvedValues();
    unsubscribe();
  });
};
