// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {useMemoize} from '@vueuse/core';
import {type GetDeliveryOptions} from '@myparcel/sdk';
import {useSdk} from '../composables/useSdk';

export const getDeliveryOptions = useMemoize((parameters: GetDeliveryOptions['parameters']) => {
  const sdk = useSdk();

  return sdk.getDeliveryOptions({parameters});
});
