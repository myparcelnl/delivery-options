import {ref, type Ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type UsePickupLocation, usePickupLocation} from './usePickupLocation';

const getSelectedPickupLocation = useMemoize(() => ref());

export const useSelectedPickupLocation = (): {
  locationCode: Ref<string>;
  location: Ref<UsePickupLocation | undefined>;
} => {
  const model = getSelectedPickupLocation();
  const fullLocation = usePickupLocation(model);

  return {
    locationCode: model,
    location: fullLocation,
  };
};
