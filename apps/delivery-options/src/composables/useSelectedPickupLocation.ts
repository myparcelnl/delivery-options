import {ref, type Ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type FullPickupLocation, usePickupLocation} from './fullPickupLocation';

const getSelectedPickupLocation = useMemoize(() => ref());

export const useSelectedPickupLocation = (): {
  locationCode: Ref<string>;
  location: Ref<FullPickupLocation | undefined>;
} => {
  const model = getSelectedPickupLocation();
  const fullLocation = usePickupLocation(model);

  return {
    locationCode: model,
    location: fullLocation,
  };
};
