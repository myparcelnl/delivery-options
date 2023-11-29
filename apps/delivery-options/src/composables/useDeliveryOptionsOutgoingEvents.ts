import {nextTick, ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {DeliveryOptionsStoreAction, UPDATED_DELIVERY_OPTIONS, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {convertOutput} from '../utils';
import {type DeliveryOptionsEmits} from '../types';

const DEBOUNCE_DELAY = 50;

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const store = useDeliveryOptionsStore();
  const outputValues = ref<string>();

  const {history} = useRefHistory(outputValues);

  const listener = useDebounceFn(async (action) => {
    if (action.name !== DeliveryOptionsStoreAction.UpdateOutput) {
      return;
    }

    const previousHistoryLength = history.value.length;

    const output = convertOutput(action.args[0]);
    outputValues.value = JSON.stringify(output);

    await nextTick();

    // If unchanged, don't emit.
    if (history.value.length > 1 && history.value.length === previousHistoryLength) {
      return;
    }

    document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: output}));
    emit('update', output);
  }, DEBOUNCE_DELAY);

  store.$onAction(listener);
};
