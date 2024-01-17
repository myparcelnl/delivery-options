import {nextTick, ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {type DeliveryOptionsEmits} from '../../types';
import {OUTPUT_EVENT_DEBOUNCE_DELAY, UPDATED_DELIVERY_OPTIONS} from '../../data';
import {type InternalOutput} from '../../../../../libs/shared/src';
import {convertOutput} from './convertOutput';

export const useDeliveryOptionsOutgoingEvents = (
  emit: DeliveryOptionsEmits,
): ((internalOutput: InternalOutput) => void) => {
  const outputValues = ref<string>();

  const {history} = useRefHistory(outputValues);

  return useDebounceFn(async (internalOutput: InternalOutput) => {
    const previousHistoryLength = history.value.length;

    const output = convertOutput(internalOutput);

    outputValues.value = JSON.stringify(output);

    await nextTick();

    // If unchanged, don't emit.
    if (history.value.length > 1 && history.value.length === previousHistoryLength) {
      return;
    }

    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: output}));
    emit('update', output);
  }, OUTPUT_EVENT_DEBOUNCE_DELAY);
};
