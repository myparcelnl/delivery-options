import {ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {type DeliveryOptionsOutput, UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {type DeliveryOptionsEmits} from '../types';

const UPDATE_DELIVERY_OPTIONS_DEBOUNCE = 300;

let callbackFn: (values: DeliveryOptionsOutput) => void;

const history = useRefHistory<Partial<DeliveryOptionsOutput>>(ref({}), {deep: true});

export function useUpdateDeliveryOptions(emit: DeliveryOptionsEmits): (values: DeliveryOptionsOutput) => void {
  let last;

  if (!callbackFn) {
    callbackFn = useDebounceFn((values: DeliveryOptionsOutput) => {
      last = history.last.value.snapshot ?? null;

      // If unchanged, don't emit.
      if (last && JSON.stringify(last) === JSON.stringify(values)) {
        return;
      }

      history.source.value = values;

      document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: values}));
      emit('update', values);
    }, UPDATE_DELIVERY_OPTIONS_DEBOUNCE);
  }

  return callbackFn;
}
