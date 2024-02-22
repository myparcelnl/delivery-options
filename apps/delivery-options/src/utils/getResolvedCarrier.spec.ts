/* eslint-disable max-nested-callbacks */
import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {setActivePinia, createPinia} from 'pinia';
import {
  CarrierSetting,
  KEY_CONFIG,
  KEY_CARRIER_SETTINGS,
  CustomDeliveryType,
  waitForRequestData,
  useCarrierRequest,
  KEY_ADDRESS,
  AddressField,
} from '@myparcel-do/shared';
import {ZIMBABWE} from '@myparcel/constants/countries';
import {CarrierName, PlatformName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';

describe('getResolvedCarrier', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());

    await waitForRequestData(useCarrierRequest, [CarrierName.DhlForYou]);
  });

  afterEach(() => {
    getResolvedCarrier.clear();
  });

  it('exposes delivery types, filtered by config', async () => {
    const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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

    expect(carrier.deliveryTypes.value).toEqual(new Set([DeliveryTypeName.Standard]));

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

    expect(carrier.deliveryTypes.value).toEqual(
      new Set([CustomDeliveryType.SameDay, DeliveryTypeName.Pickup, DeliveryTypeName.Standard]),
    );
  });

  it('exposes package types', async () => {
    const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

    expect(carrier.packageTypes.value).toEqual(new Set([PackageTypeName.Package, PackageTypeName.Mailbox]));
  });

  it('exposes shipment options, filtered by config', async () => {
    const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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

  it('exposes features, filtered by config', async () => {
    const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

    expect(carrier.features.value).toEqual(
      new Set([
        CarrierSetting.AllowOnlyRecipient,
        CarrierSetting.AllowPickupLocations,
        CarrierSetting.AllowSameDayDelivery,
        CarrierSetting.AllowSignature,
        CarrierSetting.AllowStandardDelivery,
        CarrierSetting.DeliveryDaysWindow,
        CarrierSetting.DropOffDays,
        CarrierSetting.DropOffDelay,
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
      new Set([
        CarrierSetting.AllowPickupLocations,
        CarrierSetting.DeliveryDaysWindow,
        CarrierSetting.DropOffDays,
        CarrierSetting.DropOffDelay,
      ]),
    );
  });

  describe('hasDelivery', () => {
    it('returns true if any delivery type is enabled', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowDeliveryOptions]: true,
                [CarrierSetting.AllowStandardDelivery]: true,
              },
            },
          },
        }),
      );

      expect(carrier.hasDelivery.value).toEqual(true);
    });

    it('returns false if no delivery types are enabled', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasDelivery.value).toEqual(false);
    });

    it('returns false if no delivery types are available in the current country', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_ADDRESS]: {
            [AddressField.Country]: ZIMBABWE,
          },
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowDeliveryOptions]: true,
                [CarrierSetting.AllowStandardDelivery]: true,
              },
            },
          },
        }),
      );

      expect(carrier.hasDelivery.value).toEqual(false);
    });
  });

  describe('hasFakeDelivery', () => {
    it('returns true if fakeDelivery is available', async () => {
      const carrier = await getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(true);
    });

    it('returns false if fake delivery is not available', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(false);
    });
  });

  describe('hasAnyDelivery', () => {
    it('returns true if any delivery type is available', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      mockDeliveryOptionsConfig(
        getMockDeliveryOptionsConfiguration({
          [KEY_CONFIG]: {
            [KEY_CARRIER_SETTINGS]: {
              [CarrierName.DhlForYou]: {
                [CarrierSetting.AllowDeliveryOptions]: true,
                [CarrierSetting.AllowStandardDelivery]: true,
              },
            },
          },
        }),
      );

      expect(carrier.hasAnyDelivery.value).toEqual(true);
    });

    it('returns true if fake delivery is available', async () => {
      const carrier = await getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

      expect(carrier.hasAnyDelivery.value).toEqual(true);
    });

    it('returns false if fake delivery and regular delivery are both not available', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(false);
    });
  });

  describe('hasPickup', () => {
    it('returns true if pickup is enabled', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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

      expect(carrier.hasPickup.value).toEqual(true);
    });

    it('returns false if pickup is not enabled', async () => {
      const carrier = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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

      const postNl = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);
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

      const postnl = await getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);
      const result = postnl.get(CarrierSetting.CutoffTimeSameDay);

      expect(result).toBe('12:00');
    });
  });
});
