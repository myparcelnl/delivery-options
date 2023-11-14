// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {useMemoize} from '@vueuse/core';
import {useSdk} from '../composables/useSdk';

export const getCarriers = useMemoize(() => {
  const sdk = useSdk();

  return sdk.getCarriers();
});
