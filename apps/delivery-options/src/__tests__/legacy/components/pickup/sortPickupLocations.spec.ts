import {describe, expect, it} from 'vitest';
import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';

describe('sorting pickup locations', () => {
  it('sorts by distance when distances are shown', () => {
    mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.FEATURE_PICKUP_SHOW_DISTANCE]: true,
      },
    });
    const sorted = sortPickupLocations(fakePickupLocationsResponse());
    const distances = sorted.map(({location}) => location.distance);

    const sortedByDistance = [...distances].sort((distanceA, distanceB) => {
      return distanceA - distanceB;
    });

    expect(distances).toStrictEqual(sortedByDistance);
  });

  it('sorts alphabetically by location name when distances are hidden', () => {
    mockConfigBus({
      [KEY_CONFIG]: {
        [CONFIG.FEATURE_PICKUP_SHOW_DISTANCE]: false,
      },
    });
    const sorted = sortPickupLocations(fakePickupLocationsResponse());
    const names = sorted.map(({location}) => location.location_name);

    const sortedByName = [...names].sort((nameA, nameB) => {
      return nameA < nameB ? -1 : 1;
    });

    expect(names).toStrictEqual(sortedByName);
  });
});
