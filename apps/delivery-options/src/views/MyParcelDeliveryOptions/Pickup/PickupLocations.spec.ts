import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {render} from '@testing-library/vue';
import {mockGetPickupLocations, fakePickupLocationsResponse} from '@myparcel-dev/do-shared/testing';
import {KEY_CONFIG, KEY_CARRIER_SETTINGS, CarrierSetting, ConfigSetting, PickupLocationsView} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useSelectedValues} from '../../../composables';
import {
  mockDeliveryOptionsConfig,
  getMockDeliveryOptionsConfiguration,
  waitForPickupLocations,
} from '../../../__tests__';
import PickupLocations from './PickupLocations.vue';

describe('PickupLocations.vue — carrier-preferred auto-select', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          // Use list view to avoid mounting the Leaflet-backed map child,
          // which fails in happy-dom with an unhandled CDN script-load rejection.
          [ConfigSetting.PickupLocationsDefaultView]: PickupLocationsView.List,
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {[CarrierSetting.AllowPickupLocations]: true},
            [CarrierName.DhlForYou]: {[CarrierSetting.AllowPickupLocations]: true},
          },
        },
      }),
    );

    // Make DhlForYou locations come first (distance 0) so that value[0] is always DhlForYou.
    // This guarantees the bug is observable: the current code would overwrite carrier.value
    // with DhlForYou even when PostNL was pre-selected.
    mockGetPickupLocations.mockImplementation((_endpoint, options) => {
      const carrier = options?.parameters?.carrier as string | undefined;

      if (carrier === CarrierName.DhlForYou) {
        const [location] = fakePickupLocationsResponse();

        return [
          {
            ...location,
            location: {
              ...location.location,
              distance: '0',
            },
          },
        ];
      }

      return fakePickupLocationsResponse();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockGetPickupLocations.mockClear();
  });

  it('prefers a location matching the pre-selected carrier instead of value[0]', async () => {
    const {carrier, pickupLocation} = useSelectedValues();
    carrier.value = CarrierName.PostNl;

    render(PickupLocations);
    await waitForPickupLocations();
    await flushPromises();

    expect(carrier.value).toBe(CarrierName.PostNl);
    expect(pickupLocation.value).toBeDefined();
  });

  it('falls back to value[0] when carrier is undefined (existing behavior)', async () => {
    const {carrier, pickupLocation} = useSelectedValues();
    carrier.value = undefined;

    render(PickupLocations);
    await waitForPickupLocations();
    await flushPromises();

    expect(pickupLocation.value).toBeDefined();
    expect(carrier.value).toBeDefined();
  });
});
