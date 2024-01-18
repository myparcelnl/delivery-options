import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {
  CarrierSetting,
  type DeliveryOptionsOutput,
  type InternalOutput,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  useCarrierRequest,
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type SelectedDeliveryMoment} from '../../types';
import {HOME_OR_PICKUP_HOME, HOME_OR_PICKUP_PICKUP} from '../../data';
import {waitForPickupLocations} from '../../__tests__/utils/waitForPickupLocations';
import {waitForDeliveryOptions} from '../../__tests__/utils/waitForDeliveryOptions';
import {getMockDeliveryOptionsConfiguration, mockDeliveryOptionsConfig} from '../../__tests__';

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

describe.skip('convertOutput', () => {
  beforeEach(async () => {
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

    await useCarrierRequest(CarrierName.PostNl).load();
    await waitForDeliveryOptions();
    await waitForPickupLocations();
  });

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
        pickupLocation: '176688',
      }),

      external: createExternalOutput({
        isPickup: true,
        date: undefined,
        deliveryType: DeliveryTypeName.Pickup,
        pickupLocation: expect.any(Object),
      }),
    },
  ] satisfies TestInput[])('converts internal output to external output', ({internal, external}) => {
    expect.assertions(1);

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
