import {type PickupLocation} from '@myparcel/sdk';
import {fakePickupLocationsResponse} from '../mocks';

export const getFakePickupLocation = (locationCode: string): PickupLocation => {
  const all = fakePickupLocationsResponse();
  const found = all.find((location) => location.location.location_code === locationCode);

  if (!found) {
    throw new Error();
  }

  return found;
};
