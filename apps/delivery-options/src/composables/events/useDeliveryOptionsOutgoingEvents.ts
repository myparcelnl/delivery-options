import {onUnmounted, watch} from 'vue';
import {isDef, useDebounceFn} from '@vueuse/core';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS, OUTPUT_EVENT_DEBOUNCE_DELAY} from '../../data';
import {useResolvedValues} from './useResolvedValues';

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();

  const cb = useDebounceFn((values, oldValues) => {
    if (!isDef(values) && !isDef(oldValues)) {
      return;
    }

    emit('update', values);
    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  }, OUTPUT_EVENT_DEBOUNCE_DELAY);

  const unwatch = watch(resolvedValues, cb, {deep: true, immediate: true});
  onUnmounted(unwatch);
};
