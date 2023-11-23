import {ref} from 'vue';
import {useDebounceFn, useRefHistory} from '@vueuse/core';
import {
  type DeliveryOptionsOutput,
  type InternalOutput,
  UPDATED_DELIVERY_OPTIONS,
  useDeliveryOptionsStore,
} from '@myparcel-do/shared';
import {convertOutput} from '../utils/convertOutput';
import {type DeliveryOptionsEmits} from '../types';

const history = useRefHistory<Partial<DeliveryOptionsOutput>>(ref({}), {deep: true});

const updateExternalOutput = useDebounceFn((output: InternalOutput, emit: DeliveryOptionsEmits) => {
  const externalOutput = convertOutput(output);

  const last = history.last.value.snapshot ?? null;

  // If unchanged, don't emit.
  if (last && JSON.stringify(last) === JSON.stringify(externalOutput)) {
    return;
  }

  history.source.value = externalOutput;

  document.dispatchEvent(new CustomEvent(UPDATED_DELIVERY_OPTIONS, {detail: externalOutput}));
  emit('update', externalOutput);
});

export const useDeliveryOptionsOutgoingEvents = (emit: DeliveryOptionsEmits): void => {
  const store = useDeliveryOptionsStore();

  store.$onAction((action) => {
    if (action.name !== 'updateOutput') {
      return;
    }

    void updateExternalOutput(action.args[0], emit);
  });
};
