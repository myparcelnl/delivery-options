/* eslint-disable max-nested-callbacks */
import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {
  CarrierId,
  CarrierName,
  DeliveryTypeName,
  PackageTypeName,
  PlatformName,
  ShipmentOptionName,
} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {CarrierSetting} from '../data';
import {getFullCarrier} from './getFullCarrier';

describe('getFullCarrier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each([
    [CarrierName.PostNl, PlatformName.MyParcel],
    [`${CarrierName.PostNl}:12345`, PlatformName.MyParcel],
    [CarrierName.PostNl, PlatformName.SendMyParcel],
    [`${CarrierName.PostNl}:12345`, PlatformName.SendMyParcel],
  ] satisfies [CarrierIdentifier, SupportedPlatformName][])(
    'returns carrier data for %s on platform %s',
    async (identifier, platform) => {
      expect.assertions(5);

      const postNl = await getFullCarrier(identifier, platform);

      expect(postNl).toBeDefined();
      expect(postNl.id).toBe(CarrierId.PostNl);
      expect(postNl.name).toBe(CarrierName.PostNl);
      expect(postNl.human).toBeTypeOf('string');
      expect(postNl.meta).toBeInstanceOf(Object);
    },
  );

  describe('exposes utility methods', () => {
    it('can use hasPackageType', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasPackageType(PackageTypeName.DigitalStamp)).toBe(true);
      expect(dhlForYou.hasPackageType(PackageTypeName.DigitalStamp)).toBe(false);
    });

    it('can use hasDeliveryType', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasDeliveryType(DeliveryTypeName.Morning)).toBe(true);
      expect(dhlForYou.hasDeliveryType(DeliveryTypeName.Morning)).toBe(false);
    });

    it('can use hasShipmentOption', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasShipmentOption(ShipmentOptionName.OnlyRecipient)).toBe(true);
      expect(dhlForYou.hasShipmentOption(ShipmentOptionName.OnlyRecipient)).toBe(true);
    });

    it('can use hasFeature', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasFeature(CarrierSetting.AllowMondayDelivery)).toBe(true);
      expect(dhlForYou.hasFeature(CarrierSetting.AllowMondayDelivery)).toBe(false);
    });

    it('can use hasDeliveryInCountry', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasDeliveryInCountry('NL')).toBe(true);
      expect(dhlForYou.hasDeliveryInCountry('NL')).toBe(true);
    });

    it('can use hasPickupInCountry', async () => {
      expect.assertions(2);

      const postNl = await getFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = await getFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      expect(postNl.hasPickupInCountry('BE')).toBe(true);
      expect(dhlForYou.hasPickupInCountry('BE')).toBe(false);
    });
  });
});
