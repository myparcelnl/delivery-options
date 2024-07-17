import {type PromiseOr} from '@myparcel/ts-utils';
import {useResolvedPickupLocations} from '../../composables';

export const waitForPickupLocations = (): PromiseOr<void> => {
  const {locations} = useResolvedPickupLocations();

  return locations.load();
};
