import {type PromiseOr} from '@myparcel-dev/ts-utils';
import {useResolvedPickupLocations} from '../../composables';

export const waitForPickupLocations = (): PromiseOr<void> => {
  const {locations} = useResolvedPickupLocations();

  return locations.load();
};
