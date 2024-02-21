import {onUnmounted, watch} from 'vue';
import {isDef, useDebounceFn} from '@vueuse/core';
import {type DeliveryOptionsEmits} from '../../types';
import {UPDATED_DELIVERY_OPTIONS} from '../../data';
import {useResolvedValues} from './useResolvedValues';

const DEBOUNCE_DELAY = 10;

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const resolvedValues = useResolvedValues();

  const cb = useDebounceFn((values) => {
    if (!isDef(values)) {
      return;
    }

    emit('update', values);
    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
  }, DEBOUNCE_DELAY);

  const unwatch = watch(resolvedValues, cb, {deep: true, immediate: true});

  onUnmounted(unwatch);
};
