import {nextTick, ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {type InternalOutput} from '@myparcel-do/shared';
import {convertOutput} from '../utils';
import {type DeliveryOptionsEmits} from '../types';
import {useDeliveryOptionsForm} from '../form';
import {FIELD_HOME_OR_PICKUP, HOME_OR_PICKUP_PICKUP, UPDATED_DELIVERY_OPTIONS} from '../data';

const DEBOUNCE_DELAY = 50;

export const useDeliveryOptionsOutgoingEvents = (
  emit: DeliveryOptionsEmits,
): ((internalOutput: InternalOutput) => void) => {
  const outputValues = ref<string>();

  const {history} = useRefHistory(outputValues);

  return useDebounceFn(async (internalOutput: InternalOutput) => {
    const previousHistoryLength = history.value.length;

    const form = useDeliveryOptionsForm();
    const isPickup = form?.getValue(FIELD_HOME_OR_PICKUP) === HOME_OR_PICKUP_PICKUP;

    const output = convertOutput(internalOutput, isPickup);
    outputValues.value = JSON.stringify(output);

    await nextTick();

    // If unchanged, don't emit.
    if (history.value.length > 1 && history.value.length === previousHistoryLength) {
      return;
    }

    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: output}));
    emit('update', output);
  }, DEBOUNCE_DELAY);
};
