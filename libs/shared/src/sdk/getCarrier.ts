// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {useMemoize} from '@vueuse/core';
import {type CarrierName} from '@myparcel/constants';
import {useSdk} from '../composables/useSdk';

export const getCarrier = useMemoize((carrier: CarrierName) => {
  const sdk = useSdk();

  return sdk.getCarrier({path: {carrier}});
});
