import {type Ref} from 'vue';
import {useSelectedPickupLocation} from './useSelectedPickupLocation';
import {type FullPickupLocation, usePickupLocation} from './fullPickupLocation';

export const useSelectedFullLocation = (): {
  locationCode: Ref<string>;
  location: Ref<FullPickupLocation | undefined>;
} => {
  const {model} = useSelectedPickupLocation();

  const fullLocation = usePickupLocation(model);

  return {
    locationCode: model,
    location: fullLocation,
  };
};
