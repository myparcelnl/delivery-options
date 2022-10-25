import * as CONFIG from '@/data/keys/configKeys';
import { fakePickupLocationsResponse } from '@Mocks/@myparcel/js-sdk/dist/data/fakePickupLocationsResponse';
import { mockConfigBus } from '@Tests/unit/delivery-options/mockConfigBus';
import { sortPickupLocations } from '@/delivery-options/data/pickup/sortPickupLocations';

describe('sorting pickup locations', () => {
  it('sorts by distance when distances are shown', () => {
    mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.FEATURE_PICKUP_SHOW_DISTANCE]: true,
      },
    });
    const sorted = sortPickupLocations(fakePickupLocationsResponse());
    const distances = sorted.map(({ location }) => location.distance);

    const sortedByDistance = [...distances].sort((distanceA, distanceB) => {
      return distanceA - distanceB;
    });

    expect(distances).toStrictEqual(sortedByDistance);
  });

  it('sorts alphabetically by location name when distances are hidden', () => {
    mockConfigBus({
      [CONFIG.KEY]: {
        [CONFIG.FEATURE_PICKUP_SHOW_DISTANCE]: false,
      },
    });
    const sorted = sortPickupLocations(fakePickupLocationsResponse());
    const names = sorted.map(({ location }) => location.location_name);

    const sortedByName = [...names].sort((nameA, nameB) => {
      return nameA < nameB ? -1 : 1;
    });

    expect(names).toStrictEqual(sortedByName);
  });
});
