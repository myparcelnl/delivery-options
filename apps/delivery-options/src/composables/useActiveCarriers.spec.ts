import {toValue} from 'vue';
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  KEY_CARRIER_SETTINGS,
  CarrierSetting,
  type CarrierIdentifier,
  KEY_CONFIG,
  KEY_ADDRESS,
  AddressField,
} from '@myparcel-dev/do-shared';
import {CarrierName} from '@myparcel-dev/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig} from '../__tests__';
import {useActiveCarriers} from './useActiveCarriers';

describe('useActiveCarriers', () => {
  beforeEach(() => {
    // Reset the state
    useConfigStore().reset();
    useAddressStore().reset();
  });

  const identifiers = [
    `${CarrierName.DhlForYou}:3456`,
    CarrierName.DhlParcelConnect,
    `${CarrierName.DhlForYou}:1234`,
    `${CarrierName.DhlParcelConnect}:422`,
    CarrierName.PostNl,
    CarrierName.DhlEuroPlus,
    `${CarrierName.PostNl}:4242`,
    CarrierName.DhlForYou,
  ] satisfies CarrierIdentifier[];

  it('filters and sorts carriers based on capabilities', async () => {
    expect.assertions(1);

    useActiveCarriers.clear();

    const carrierSettings = Object.fromEntries(
      identifiers.map((identifier) => [
        identifier,
        {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowStandardDelivery]: true,
        },
      ]),
    );

    mockDeliveryOptionsConfig({
      [KEY_ADDRESS]: {
        [AddressField.Country]: 'NL',
      },
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: carrierSettings,
      },
    });

    const carriers = useActiveCarriers();

    // Trigger first evaluation to start capabilities loading
    toValue(carriers);
    await flushPromises();

    // After capabilities load, the computed re-evaluates with carrier data
    const carrierIdentifiers = toValue(carriers).map((carrier) => carrier.carrier.value.identifier);

    expect(carrierIdentifiers).toContain(CarrierName.PostNl);
  });

  it('returns multiple carriers with pickup from capabilities', async () => {
    useActiveCarriers.clear();

    const carrierSettings = Object.fromEntries(
      [CarrierName.PostNl, CarrierName.DhlForYou, CarrierName.Dpd].map((identifier) => [
        identifier,
        {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowStandardDelivery]: true,
          [CarrierSetting.AllowPickupLocations]: true,
        },
      ]),
    );

    mockDeliveryOptionsConfig({
      [KEY_ADDRESS]: {
        [AddressField.Country]: 'NL',
      },
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: carrierSettings,
      },
    });

    const carriers = useActiveCarriers();

    toValue(carriers);
    await flushPromises();

    const resolved = toValue(carriers);
    const withPickup = resolved.filter((carrier) => toValue(carrier.hasPickup));
    const pickupIdentifiers = withPickup.map((carrier) => carrier.carrier.value.identifier);

    // PostNL, DHL_FOR_YOU, and DPD all have PICKUP_DELIVERY in mock capabilities
    expect(pickupIdentifiers).toContain(CarrierName.PostNl);
    expect(pickupIdentifiers).toContain(CarrierName.DhlForYou);
    expect(pickupIdentifiers).toContain(CarrierName.Dpd);
  });

  it('returns carriers with hasAnyDelivery=true for carriers with delivery types', async () => {
    useActiveCarriers.clear();

    const carrierSettings = Object.fromEntries(
      [CarrierName.PostNl, CarrierName.DhlForYou, CarrierName.Dpd].map((identifier) => [
        identifier,
        {
          [CarrierSetting.AllowDeliveryOptions]: true,
          [CarrierSetting.AllowStandardDelivery]: true,
          [CarrierSetting.AllowPickupLocations]: true,
        },
      ]),
    );

    mockDeliveryOptionsConfig({
      [KEY_ADDRESS]: {
        [AddressField.Country]: 'NL',
      },
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: carrierSettings,
      },
    });

    const carriers = useActiveCarriers();

    toValue(carriers);
    await flushPromises();

    const resolved = toValue(carriers);
    const withDelivery = resolved.filter((carrier) => toValue(carrier.hasAnyDelivery));
    const deliveryIdentifiers = withDelivery.map((carrier) => carrier.carrier.value.identifier);

    // PostNL, DHL_FOR_YOU, and DPD all have STANDARD_DELIVERY in mock capabilities
    expect(deliveryIdentifiers).toContain(CarrierName.PostNl);
    expect(deliveryIdentifiers).toContain(CarrierName.DhlForYou);
    expect(deliveryIdentifiers).toContain(CarrierName.Dpd);
  });
});
