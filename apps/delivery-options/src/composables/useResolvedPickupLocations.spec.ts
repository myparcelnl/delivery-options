import {describe, it, beforeEach, expect, afterEach, vi} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {mockGetPickupLocations, fakePickupLocationsResponse} from '@myparcel-dev/do-shared/testing';
import {KEY_CONFIG, ConfigSetting, CarrierSetting, KEY_CARRIER_SETTINGS} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useConfigStore} from '../stores';
import {
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  waitForPickupLocations,
} from '../__tests__';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';

async function load(): Promise<void> {
  await waitForPickupLocations();
}

describe('useResolvedPickupLocations', () => {
  beforeEach(() => {
    useConfigStore().reset();

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [ConfigSetting.PickupMapAllowLoadMore]: true,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowPickupLocations]: true,
            },
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowPickupLocations]: false,
            },
            [`${CarrierName.DhlForYou}:123`]: {
              [CarrierSetting.AllowPickupLocations]: true,
            },
            [CarrierName.Dpd]: {
              [CarrierSetting.AllowPickupLocations]: false,
            },
          },
        },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockGetPickupLocations.mockClear();
  });

  it('loads pickup locations', async () => {
    const fakeResponse = fakePickupLocationsResponse();
    expect.assertions(1 + fakeResponse.length * 2);

    await load();

    const {locations} = useResolvedPickupLocations();

    // For each carrier that has pickup, this response should be returned.
    expect(locations.value.length).toBe(fakeResponse.length * 2);

    locations.value.forEach((location) => {
      expect(location).toMatchObject({
        carrier: expect.any(String),
        locationCode: expect.any(String),
        locationName: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        street: expect.any(String),
        number: expect.any(String),
        postalCode: expect.any(String),
        city: expect.any(String),
        cc: expect.any(String),
        openingHours: expect.any(Array),
      });
    });
  });

  it('loads more location using latitude and longitude', async () => {
    expect.assertions(2);
    await load();

    const {loadMoreLocations, locations} = useResolvedPickupLocations();

    const initialLength = locations.value.length;

    const newLocation = {...fakePickupLocationsResponse()[0]};

    newLocation.location.location_name = 'New location found with LatLng';
    // Locations are deduplicated by location_code, so we need to change this to make it unique
    newLocation.location.location_code = 'some-location-code';

    mockGetPickupLocations.mockReturnValueOnce([newLocation]);

    await loadMoreLocations(52.378, 4.9);
    await flushPromises();

    // Expect new locations to have been fetched and added to the list
    expect(locations.value.length).toBe(initialLength + 1);
    // One for each carrier (DHL/POSTNL) and one for getting the new location. Only PostNL can use the latitude and longitude option.
    expect(mockGetPickupLocations).toHaveBeenCalledTimes(3);
  });

  it('can reset pickup locations array', async () => {
    await load();

    const {locations, reset} = useResolvedPickupLocations();

    expect(locations.value.length).toBeGreaterThan(0);

    reset();

    expect(locations.value.length).toBe(0);
  });
});
