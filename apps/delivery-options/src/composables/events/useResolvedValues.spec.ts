import {beforeEach, describe, expect, it} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  AddressField,
  CarrierSetting,
  type DeliveryOptionsOutput,
  type InternalOutput,
  KEY_ADDRESS,
  KEY_CARRIER_SETTINGS,
  KEY_CONFIG,
  useCarriersRequest,
  ConfigSetting,
  type InputDeliveryOptionsConfig,
} from '@myparcel-dev/do-shared';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useConfigStore} from '../../stores';
import {
  HOME_OR_PICKUP_PICKUP,
  FIELD_HOME_OR_PICKUP,
  FIELD_PICKUP_LOCATION,
  FIELD_SHIPMENT_OPTIONS,
  FIELD_DELIVERY_DATE,
  FIELD_DELIVERY_MOMENT,
} from '../../data';
import {
  createInternalOutput,
  createExternalOutput,
  waitForPickupLocations,
  waitForDeliveryOptions,
  getMockDeliveryOptionsConfiguration,
  mockDeliveryOptionsConfig,
  mockSelectedDeliveryOptions,
} from '../../__tests__';
import {useResolvedValues} from './useResolvedValues';

interface TestInput {
  config?: Partial<InputDeliveryOptionsConfig>;
  external: DeliveryOptionsOutput;
  internal: InternalOutput;
  name: string;
}

describe('useResolvedValues', () => {
  beforeEach(async () => {
    useConfigStore().reset();

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.PostNl]: {
              [CarrierSetting.AllowDeliveryOptions]: true,
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.AllowPickupLocations]: true,
            },
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowDeliveryOptions]: true,
              [CarrierSetting.AllowStandardDelivery]: true,
              [CarrierSetting.AllowPickupLocations]: true,
            },
          },
        },
      }),
    );

    await Promise.all([useCarriersRequest().load(), waitForDeliveryOptions(), waitForPickupLocations()]);
  });

  it.each([
    {
      name: 'default values',
      internal: createInternalOutput(),
      external: createExternalOutput({
        [FIELD_SHIPMENT_OPTIONS]: {
          onlyRecipient: false,
          signature: false,
        },
      }),
    },
    {
      name: 'default values with signature and only recipient disabled',
      config: {
        [CarrierSetting.AllowSignature]: false,
        [CarrierSetting.AllowOnlyRecipient]: false,
      },
      internal: createInternalOutput(),
      external: createExternalOutput(),
    },

    {
      name: 'onlyRecipient enabled but not selected',
      config: {
        [CarrierSetting.AllowOnlyRecipient]: true,
      },

      internal: createInternalOutput({
        [FIELD_DELIVERY_DATE]: '2023-12-31',
        [FIELD_DELIVERY_MOMENT]: {
          carrier: CarrierName.DhlForYou,
          deliveryType: DeliveryTypeName.Morning,
        },
        [FIELD_SHIPMENT_OPTIONS]: [ShipmentOptionName.Signature],
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
      name: 'pickup',
      config: {},

      internal: createInternalOutput({
        [FIELD_HOME_OR_PICKUP]: HOME_OR_PICKUP_PICKUP,
        [FIELD_PICKUP_LOCATION]: '176688',
      }),

      external: createExternalOutput({
        isPickup: true,
        date: undefined,
        deliveryType: DeliveryTypeName.Pickup,
        pickupLocation: expect.objectContaining({
          locationCode: '176688',
        }),
      }),
    },
  ] satisfies TestInput[])(
    'converts internal output to external output with $name',
    async ({internal, external, config}) => {
      expect.assertions(1);

      mockDeliveryOptionsConfig({[KEY_CONFIG]: config});
      mockSelectedDeliveryOptions(internal);
      await flushPromises();

      const resolvedValues = useResolvedValues();

      expect(resolvedValues.value).toEqual(external);
    },
  );

  it('respects deprecated show delivery date setting while it still exists', async () => {
    mockDeliveryOptionsConfig({[KEY_CONFIG]: {[ConfigSetting.ShowDeliveryDate]: true}});
    mockSelectedDeliveryOptions();
    await flushPromises();

    const resolvedValues = useResolvedValues();

    expect(resolvedValues.value).toBeDefined();
    expect(resolvedValues.value?.date).toBeDefined();

    mockDeliveryOptionsConfig({
      [KEY_CONFIG]: {[ConfigSetting.ShowDeliveryDate]: false},
    });
    await flushPromises();

    expect(resolvedValues.value?.date).toBeUndefined();
  });

  it('does not expose priorityDelivery outside NL even when selected and enabled', async () => {
    mockDeliveryOptionsConfig({
      [KEY_ADDRESS]: {
        [AddressField.Country]: 'BE',
      },
      [KEY_CONFIG]: {
        [KEY_CARRIER_SETTINGS]: {
          [CarrierName.PostNl]: {
            [CarrierSetting.AllowPriorityDelivery]: true,
            [CarrierSetting.AllowOnlyRecipient]: false,
            [CarrierSetting.AllowSignature]: false,
          },
        },
      },
    });

    mockSelectedDeliveryOptions(
      createInternalOutput({
        [FIELD_SHIPMENT_OPTIONS]: [ShipmentOptionName.PriorityDelivery],
      }),
    );
    await flushPromises();

    const resolvedValues = useResolvedValues();

    expect(resolvedValues.value).toEqual(
      createExternalOutput({
        shipmentOptions: {},
      }),
    );
  });
});
