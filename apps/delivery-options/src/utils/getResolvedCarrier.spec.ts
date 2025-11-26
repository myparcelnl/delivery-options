/* eslint-disable max-nested-callbacks */
import {describe, it, expect, beforeEach} from 'vitest';
import {
  CarrierSetting,
  KEY_CONFIG,
  KEY_CARRIER_SETTINGS,
  CustomDeliveryType,
  KEY_ADDRESS,
  AddressField,
} from '@myparcel-dev/shared';
import {ZIMBABWE} from '@myparcel-dev/constants/countries';
import {CarrierName, PlatformName, DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {useAddressStore, useConfigStore} from '../stores';
import {mockDeliveryOptionsConfig, getMockDeliveryOptionsConfiguration} from '../__tests__';
import {getResolvedCarrier} from './getResolvedCarrier';

describe('getResolvedCarrier', () => {
  beforeEach(() => {
    useConfigStore().reset();
    useAddressStore().reset();
  });

  describe('delivery types', () => {
    it('exposes delivery types', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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
    });

    it('filters delivery types by config', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);
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

    it('filters delivery types by disabledDeliveryTypes', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      carrier.disabledDeliveryTypes.value.add(DeliveryTypeName.Standard);

      expect(carrier.deliveryTypes.value).toEqual(new Set([CustomDeliveryType.SameDay, DeliveryTypeName.Pickup]));
    });
  });

  it('exposes package types DHL For You', () => {
    const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

    expect(carrier.packageTypes.value).toEqual(
      new Set([PackageTypeName.Package, PackageTypeName.Mailbox, PackageTypeName.PackageSmall]),
    );
  });

  it('exposes package types PostNL', () => {
    const carrier = getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

    expect(carrier.packageTypes.value).toEqual(
      new Set([
        PackageTypeName.Package,
        PackageTypeName.Mailbox,
        PackageTypeName.PackageSmall,
        PackageTypeName.DigitalStamp,
      ]),
    );
  });

  it('exposes shipment options, filtered by what is allowed in config', () => {
    const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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
    expect(carrier.shipmentOptionsPerPackageType.value).toEqual({
      [PackageTypeName.Package]: new Set([ShipmentOptionName.OnlyRecipient, ShipmentOptionName.Signature]),
    });

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

    expect(carrier.shipmentOptionsPerPackageType.value).toEqual({
      [PackageTypeName.Package]: new Set([ShipmentOptionName.OnlyRecipient]),
    });
  });

  it('exposes features, filtered by config', () => {
    const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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
    it('returns false if no delivery types are available in the current country', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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
    it('returns true if fakeDelivery is available', () => {
      const carrier = getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(true);
    });

    it('returns false if fake delivery is not available', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(false);
    });
  });

  describe('hasAnyDelivery', () => {
    it('returns true if fake delivery is available', () => {
      const carrier = getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

      expect(carrier.hasAnyDelivery.value).toEqual(true);
    });

    it('returns false if fake delivery and regular delivery are both not available', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasFakeDelivery.value).toEqual(false);
    });
  });

  describe('hasPickup', () => {
    it('returns true if pickup is enabled', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

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

    it('returns false if pickup is not enabled', () => {
      const carrier = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(carrier.hasPickup.value).toEqual(false);
    });
  });

  describe('hasSmallPickup', () => {
    it('returns true if pickup is enabled', () => {
      const carrier = getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);

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

      expect(carrier.hasSmallPackagePickup.value).toEqual(true);
    });

    it('returns false if pickup is not enabled', () => {
      const carrier = getResolvedCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      expect(carrier.hasSmallPackagePickup.value).toEqual(false);
    });
  });

  describe('"get" method', () => {
    it('gets value from carrier config', () => {
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

      const postNl = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);
      const result = postNl.get(CarrierSetting.CutoffTimeSameDay);

      expect(result).toBe('11:00');
    });

    it('gets fallback from global config', () => {
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

      const postnl = getResolvedCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);
      const result = postnl.get(CarrierSetting.CutoffTimeSameDay);

      expect(result).toBe('12:00');
    });
  });
});
