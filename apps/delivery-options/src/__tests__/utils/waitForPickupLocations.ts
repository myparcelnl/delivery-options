import {waitFor} from '@testing-library/vue';
import {useResolvedPickupLocations} from '../../composables';

export const waitForPickupLocations = async (): Promise<void> => {
  const locations = useResolvedPickupLocations();

  await waitFor(() => locations.value.length > 0, {timeout: 1000});
};
