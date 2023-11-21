import {ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {type DeliveryOptionsOutput, type InternalOutput, UPDATED_DELIVERY_OPTIONS} from '@myparcel-do/shared';
import {type DeliveryOptionsEmits} from '../types';

const UPDATE_DELIVERY_OPTIONS_DEBOUNCE = 300;

let callbackFn: (values: InternalOutput) => void;

const history = useRefHistory<Partial<DeliveryOptionsOutput>>(ref({}), {deep: true});

export function useEmitDeliveryOptionsEvents(emit: DeliveryOptionsEmits): (values: InternalOutput) => void {
  let last;

  if (!callbackFn) {
    callbackFn = useDebounceFn((values: InternalOutput) => {
      const externalOutput: DeliveryOptionsOutput = {
        deliveryType: values.deliveryMoment?.deliveryType,
        packageType: values.deliveryMoment?.packageType,
        date: values.deliveryMoment?.date,
        carrier: values.deliveryMoment?.carrier,
        isPickup: false,
      };

      last = history.last.value.snapshot ?? null;

      // If unchanged, don't emit.
      if (last && JSON.stringify(last) === JSON.stringify(externalOutput)) {
        return;
      }

      history.source.value = externalOutput;

      document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: externalOutput}));
      emit('update', externalOutput);
    }, UPDATE_DELIVERY_OPTIONS_DEBOUNCE);
  }

  return callbackFn;
}
