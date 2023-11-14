// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
import {useMemoize} from '@vueuse/core';
import {type GetPickupLocations} from '@myparcel/sdk';
import {useSdk} from '../composables/useSdk';

export const getPickupLocations = useMemoize((parameters: GetPickupLocations['parameters']) => {
  const sdk = useSdk();

  return sdk.getPickupLocations({parameters});
});
