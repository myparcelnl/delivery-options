import { SENDMYPARCEL } from '@/data/keys/platformKeys';
import { fakePickupLocationsResponse } from '../../__mocks__/modules/@myparcel/js-sdk/fakePickupLocationsResponse';
import { mockConfigBus } from './mockConfigBus';
import { sortPickupLocations } from '@/delivery-options/data/pickup/sortPickupLocations';

describe('sorting pickup locations', () => {
  it('sorts by distance when distances are shown', () => {
    mockConfigBus();
    const sorted = sortPickupLocations(fakePickupLocationsResponse);
    const distances = sorted.map(({ location }) => location.distance);

    const sortedByDistance = [...distances].sort((distanceA, distanceB) => {
      return distanceA - distanceB;
    });

    expect(distances).toStrictEqual(sortedByDistance);
  });

  it('sorts alphabetically by location name when distances are hidden', () => {
    mockConfigBus(SENDMYPARCEL);
    const sorted = sortPickupLocations(fakePickupLocationsResponse);
    const names = sorted.map(({ location }) => location.location_name);

    const sortedByName = [...names].sort((nameA, nameB) => {
      return nameA < nameB ? -1 : 1;
    });

    expect(names).toStrictEqual(sortedByName);
  });
});
