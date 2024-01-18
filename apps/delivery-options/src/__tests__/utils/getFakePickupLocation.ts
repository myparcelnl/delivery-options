import {fakePickupLocationsResponse} from '@myparcel-do/shared/testing';
import {type PickupLocation} from '@myparcel/sdk';

export const getFakePickupLocation = (locationCode: string): PickupLocation => {
  const all = fakePickupLocationsResponse();
  const found = all.find((location) => location.location.location_code === locationCode);

  if (!found) {
    throw new Error();
  }

  return found;
};
