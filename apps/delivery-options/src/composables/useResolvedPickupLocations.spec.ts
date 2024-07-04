import {describe, it, beforeEach, expect} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useCarrierRequest} from '@myparcel-do/shared';
import {CarrierName} from '@myparcel/constants';
import {
  mockDeliveryOptionsConfig,
  mockDeliveryOptionsForm,
  waitForDeliveryOptions,
  waitForPickupLocations,
} from '../__tests__';
import {useResolvedPickupLocations} from './useResolvedPickupLocations';

describe('useResolvedPickupLocations', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());

    mockDeliveryOptionsConfig();

    await Promise.all([
      mockDeliveryOptionsForm(),
      useCarrierRequest(CarrierName.PostNl).load(),
      waitForDeliveryOptions(),
      waitForPickupLocations(),
    ]);
  });

  it('loads pickup locations', () => {
    const {locations} = useResolvedPickupLocations();

    expect(locations.value.length).toBeGreaterThan(0);

    locations.value.forEach((location) => {
      expect(location).toMatchObject({
        carrier: CarrierName.PostNl,
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
});
