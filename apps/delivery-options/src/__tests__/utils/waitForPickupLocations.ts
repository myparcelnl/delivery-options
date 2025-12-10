import {flushPromises} from '@vue/test-utils';
import {type PromiseOr} from '@myparcel-dev/ts-utils';
import {useResolvedPickupLocations} from '../../composables';

export const waitForPickupLocations = async (): Promise<void> => {
  const {locations} = useResolvedPickupLocations();

  await locations.load();
  await flushPromises();
};
