/* eslint-disable max-nested-callbacks */
import {describe, it, expect, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {
  CarrierSetting,
  KEY_CONFIG,
  KEY_CARRIER_SETTINGS,
  CustomDeliveryType,
  KEY_ADDRESS,
  AddressField,
} from '@myparcel-dev/do-shared';
import {ZIMBABWE} from '@myparcel-dev/constants/countries';
import {CarrierName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';

describe('getResolvedCarrier', () => {
  beforeEach(() => {
    useConfigStore().reset();
    useAddressStore().reset();
  });

  describe('delivery types', () => {
    it('exposes delivery types', async () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowPickupLocations]: false,
                [CarrierSetting.AllowSameDayDelivery]: false,
              },
            },
          },
        }),
      );

      await flushPromises();

      expect(carrier.deliveryTypes.value).toEqual(new Set([DeliveryTypeName.Evening, DeliveryTypeName.Standard]));
    });

    it('filters delivery types by config', async () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou);
      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowPickupLocations]: true,
                [CarrierSetting.AllowSameDayDelivery]: true,
              },
            },
          },
        }),
      );

      await flushPromises();

      expect(carrier.deliveryTypes.value).toEqual(
        new Set([
          CustomDeliveryType.SameDay,
          DeliveryTypeName.Evening,
          DeliveryTypeName.Pickup,
          DeliveryTypeName.Standard,
        ]),
      );
    });

    it('filters delivery types by disabledDeliveryTypes', async () => {
      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowPickupLocations]: true,
                [CarrierSetting.AllowSameDayDelivery]: true,
              },
            },
          },
        }),
      );

      const carrier = getResolvedCarrier(CarrierName.DhlForYou);

      await flushPromises();

      carrier.disabledDeliveryTypes.value.add(DeliveryTypeName.Standard);

      expect(carrier.deliveryTypes.value).toEqual(
        new Set([CustomDeliveryType.SameDay, DeliveryTypeName.Evening, DeliveryTypeName.Pickup]),
      );
    });
  });

  it('exposes shipment options, filtered by what is allowed in config', async () => {
    const carrier = getResolvedCarrier(CarrierName.DhlForYou);

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowOnlyRecipient]: true,
              [CarrierSetting.AllowSignature]: true,
            },
          },
        },
      }),
    );

    await flushPromises();

    expect(carrier.shipmentOptions.value).toEqual(
      new Set([ShipmentOptionName.OnlyRecipient, ShipmentOptionName.Signature]),
    );

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowSignature]: false,
            },
          },
        },
      }),
    );

    expect(carrier.shipmentOptions.value).toEqual(new Set([ShipmentOptionName.OnlyRecipient]));
  });

  it('derives packageTypes from capabilities', async () => {
    const carrier = getResolvedCarrier(CarrierName.PostNl);

    mockDeliveryOptionsConfig(getMockDeliveryOptionsConfiguration());

    await flushPromises();

    expect(carrier.packageTypes.value).toEqual(
      new Set([
        PackageTypeName.Package,
        PackageTypeName.Mailbox,
        PackageTypeName.DigitalStamp,
        PackageTypeName.PackageSmall,
        PackageTypeName.Envelope,
      ]),
    );
  });

  it('returns empty packageTypes set for unknown carrier', async () => {
    const carrier = getResolvedCarrier('unknown_carrier');

    mockDeliveryOptionsConfig(getMockDeliveryOptionsConfiguration());

    await flushPromises();

    expect(carrier.packageTypes.value).toEqual(new Set());
  });

  it('exposes features, filtered by config', async () => {
    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowEveningDelivery]: true,
              [CarrierSetting.AllowOnlyRecipient]: true,
              [CarrierSetting.AllowPickupLocations]: true,
              [CarrierSetting.AllowSameDayDelivery]: true,
              [CarrierSetting.AllowSignature]: true,
              [CarrierSetting.AllowStandardDelivery]: true,
            },
          },
        },
      }),
    );

    const carrier = getResolvedCarrier(CarrierName.DhlForYou);

    await flushPromises();

    expect(carrier.features.value).toEqual(
      new Set([
        CarrierSetting.AllowEveningDelivery,
        CarrierSetting.AllowOnlyRecipient,
        CarrierSetting.AllowPickupLocations,
        CarrierSetting.AllowSameDayDelivery,
        CarrierSetting.AllowSignature,
        CarrierSetting.AllowStandardDelivery,
      ]),
    );

    mockDeliveryOptionsConfig(
      getMockDeliveryOptionsConfiguration({
        [KEY_CONFIG]: {
          [KEY_CARRIER_SETTINGS]: {
            [CarrierName.DhlForYou]: {
              [CarrierSetting.AllowOnlyRecipient]: false,
              [CarrierSetting.AllowSameDayDelivery]: false,
              [CarrierSetting.AllowSignature]: false,
              [CarrierSetting.AllowStandardDelivery]: false,
            },
          },
        },
      }),
    );

    expect(carrier.features.value).toEqual(
      new Set([CarrierSetting.AllowEveningDelivery, CarrierSetting.AllowPickupLocations]),
    );
  });

  describe('hasDelivery', () => {
    it('returns false if no delivery types are available', async () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_ADDRESS]: {
            [AddressField.Country]: ZIMBABWE,
          },
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowStandardDelivery]: true,
              },
            },
          },
        }),
      );

      await flushPromises();

      expect(carrier.hasDelivery.value).toEqual(false);
    });
  });

  describe('hasPickup', () => {
    it('returns true if pickup is enabled', async () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.PostNl]: {
                [CarrierSetting.AllowPickupLocations]: true,
              },
            },
          },
        }),
      );

      await flushPromises();

      expect(carrier.hasPickup.value).toEqual(true);
    });

    it('returns false if pickup is not enabled', async () => {
      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowPickupLocations]: false,
              },
            },
          },
        }),
      );

      const carrier = getResolvedCarrier(CarrierName.DhlForYou);

      await flushPromises();

      expect(carrier.hasPickup.value).toEqual(false);
    });
  });

  describe('"get" method', () => {
    it('gets value from carrier config', async () => {
      expect.assertions(1);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [CarrierSetting.CutoffTimeSameDay]: '12:00',
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.CutoffTimeSameDay]: '11:00',
              },
            },
          },
        }),
      );

      const postNl = getResolvedCarrier(CarrierName.DhlForYou);

      await flushPromises();

      const result = postNl.get(CarrierSetting.CutoffTimeSameDay);

      expect(result).toBe('11:00');
    });

    it('gets fallback from global config', async () => {
      expect.assertions(1);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [CarrierSetting.CutoffTimeSameDay]: '12:00',
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.CutoffTimeSameDay]: undefined,
              },
            },
          },
        }),
      );

      const postnl = getResolvedCarrier(CarrierName.DhlForYou);

      await flushPromises();

      const result = postnl.get(CarrierSetting.CutoffTimeSameDay);

      expect(result).toBe('12:00');
    });
  });
});
