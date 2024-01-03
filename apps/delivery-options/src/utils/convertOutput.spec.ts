import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {flushPromises} from '@vue/test-utils';
import {
  CarrierSetting,
  type DeliveryOptionsOutput,
  type InternalOutput,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  PickupLocationType,
  useCarrierRequest,
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../types';
import {HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../data';
import {getFakePickupLocation, getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../__tests__';
import {convertOutput} from './convertOutput';

interface TestInput {
  external: DeliveryOptionsOutput;
  internal: InternalOutput;
}

const createInternalOutput = (
  overrides: Partial<Replace<InternalOutput, 'deliveryMoment', Partial<SelectedDeliveryMoment>>> = {},
): InternalOutput => {
  return {
    homeOrPickup: HOME_OR_PICKUP_HOME,
    deliveryDate: '2021-01-01',
    shipmentOptions: [],
    ...overrides,
    deliveryMoment: JSON.stringify({
      carrier: CarrierName.PostNl,
      deliveryType: DeliveryTypeName.Standard,
      packageType: PackageTypeName.Package,
      ...overrides.deliveryMoment,
    }),
  };
};

const createExternalOutput = (overrides: Partial<DeliveryOptionsOutput> = {}): DeliveryOptionsOutput => {
  return {
    carrier: CarrierName.PostNl,
    date: '2021-01-01',
    deliveryType: DeliveryTypeName.Standard,
    isPickup: false,
    packageType: PackageTypeName.Package,
    shipmentOptions: {},
    ...overrides,
  } as DeliveryOptionsOutput;
};

describe('convertOutput', () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowDeliveryOptions]: true,
              [CarrierSetting.AllowPickupLocations]: true,
            },
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowDeliveryOptions]: true,
              [CarrierSetting.AllowPickupLocations]: true,
            },
          },
        },
      }),
    );
  });

  const fakePickupLocation = getFakePickupLocation('176688');
  it.each([
    {
      internal: createInternalOutput(),
      external: createExternalOutput({
        shipmentOptions: {
          onlyRecipient: false,
          signature: false,
        },
      }),
    },

    {
      internal: createInternalOutput({
        deliveryDate: '2023-12-31',
        deliveryMoment: {
          carrier: CarrierName.DhlForYou,
          deliveryType: DeliveryTypeName.Morning,
        },
        shipmentOptions: [ShipmentOptionName.Signature],
      }),

      external: createExternalOutput({
        carrier: CarrierName.DhlForYou,
        deliveryType: DeliveryTypeName.Morning,
        date: '2023-12-31',
        isPickup: false,
        packageType: PackageTypeName.Package,
        shipmentOptions: {
          onlyRecipient: false,
          signature: true,
        },
      }),
    },

    {
      internal: createInternalOutput({
        homeOrPickup: HOME_OR_PICKUP_PICKUP,
        pickupLocation: JSON.stringify(fakePickupLocation),
      }),

      external: createExternalOutput({
        isPickup: true,
        date: undefined,
        deliveryType: DeliveryTypeName.Pickup,
        pickupLocation: {
          locationCode: fakePickupLocation.location.location_code,
          locationName: fakePickupLocation.location.location_name,
          retailNetworkId: fakePickupLocation.location.retail_network_id,
          street: fakePickupLocation.address.street,
          number: fakePickupLocation.address.number,
          numberSuffix: '',
          postalCode: fakePickupLocation.address.postal_code,
          city: fakePickupLocation.address.city,
          cc: fakePickupLocation.address.cc,
          type: PickupLocationType.Default,
        },
      }),
    },
  ] satisfies TestInput[])('converts internal output to external output', async ({internal, external}) => {
    expect.assertions(1);

    await useCarrierRequest(CarrierName.PostNl).load();
    await useCarrierRequest(CarrierName.DhlForYou).load();
    await flushPromises();

    const converted = convertOutput(internal);

    expect(converted).toEqual(external);
  });

  it('should not expose delivery date if it is disabled', () => {
    mockDeliveryOptionsConfig({
      config: {
        showDeliveryDate: false,
      },
    });

    const output = convertOutput(createInternalOutput());

    expect(output.date).toBeUndefined();
  });
});
