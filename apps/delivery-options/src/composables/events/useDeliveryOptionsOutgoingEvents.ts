import {onUnmounted, watch} from 'vue';
import {useDebounceFn} from '@vueuse/core';
import {useApiExceptions, type ParsedError, type PickupOutput, type DeliveryOutput} from '@myparcel-do/shared';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS, OUTPUT_EVENT_DEBOUNCE_DELAY, ERROR_DELIVERY_OPTIONS} from '../../data';
import {useResolvedValues} from './useResolvedValues';

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();
  const {exceptions} = useApiExceptions();

  const emitUpdate = useDebounceFn((values: PickupOutput | DeliveryOutput | undefined) => {
    if (values === undefined) {
      return;
    }

    emit('update', values);
    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  }, OUTPUT_EVENT_DEBOUNCE_DELAY);

  const handleExceptions = (exceptions: ParsedError[]) => {
    // There is a deduplication in the exceptions array, so we only handle the first exception.
    const exception = exceptions[0];

    if (exception === undefined) {
      return;
    }

    document.dispatchEvent(
      new CustomEvent(ERROR_DELIVERY_OPTIONS, {
        detail: {
          exception,
        },
      }),
    );
  };

  const unwatchResolvedValues = watch(resolvedValues, emitUpdate, {deep: true, immediate: true});
  const unwatchExceptions = watch(exceptions, handleExceptions, {deep: true, immediate: true});

  onUnmounted(() => {
    unwatchResolvedValues();
    unwatchExceptions();
  });
};
