import {onUnmounted, watch} from 'vue';
import {useDebounceFn, isDef} from '@vueuse/core';
import {useApiExceptions, type PickupOutput} from '@myparcel-dev/shared';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS, OUTPUT_EVENT_DEBOUNCE_DELAY, ERROR_DELIVERY_OPTIONS} from '../../data';
import {useResolvedValues} from './useResolvedValues';

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();
  const {exceptions} = useApiExceptions();

  const emitUpdate = useDebounceFn((values, oldValues: PickupOutput) => {
    if (!isDef(values) && !isDef(oldValues)) {
      return;
    }

    emit('update', values);
    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  }, OUTPUT_EVENT_DEBOUNCE_DELAY);

  const handleExceptions = (length: number) => {
    if (length === 0) {
      return;
    }

    document.dispatchEvent(
      new CustomEvent(ERROR_DELIVERY_OPTIONS, {
        // We emit the last exception in the array.
        detail: {exception: exceptions.value[length - 1]},
      }),
    );
  };

  const unwatchResolvedValues = watch(resolvedValues, emitUpdate, {deep: true, immediate: true});
  // When the exceptions array changes, we check based on the length of the array if there are any exceptions.
  const unwatchExceptions = watch(() => exceptions.value.length, handleExceptions, {immediate: true});

  onUnmounted(() => {
    unwatchResolvedValues();
    unwatchExceptions();
  });
};
