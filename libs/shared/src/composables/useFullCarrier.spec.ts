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
import {useFullCarrier} from './useFullCarrier';
import {useCarrierRequest} from './sdk';

async function loadCarriers(): Promise<void> {
  await useCarrierRequest(CarrierName.PostNl).load();
  await useCarrierRequest(CarrierName.DhlForYou).load();
}

describe('useFullCarrier', () => {
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
      expect.assertions(6);

      const postNl = useFullCarrier(identifier, platform);

      // Still loading
      expect(postNl.value).toBeUndefined();

      await loadCarriers();

      expect(postNl.value).toBeDefined();
      expect(postNl.value.id).toBe(CarrierId.PostNl);
      expect(postNl.value.name).toBe(CarrierName.PostNl);
      expect(postNl.value.human).toBeTypeOf('string');
      expect(postNl.value.meta).toBeInstanceOf(Object);
    },
  );

  describe('exposes utility methods', () => {
    it('can use hasPackageType', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasPackageType(PackageTypeName.DigitalStamp)).toBe(true);
      expect(dhlForYou.value.hasPackageType(PackageTypeName.DigitalStamp)).toBe(false);
    });

    it('can use hasDeliveryType', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasDeliveryType(DeliveryTypeName.Morning)).toBe(true);
      expect(dhlForYou.value.hasDeliveryType(DeliveryTypeName.Morning)).toBe(false);
    });

    it('can use hasShipmentOption', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasShipmentOption(ShipmentOptionName.OnlyRecipient)).toBe(true);
      expect(dhlForYou.value.hasShipmentOption(ShipmentOptionName.OnlyRecipient)).toBe(true);
    });

    it('can use hasFeature', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasFeature(CarrierSetting.AllowMondayDelivery)).toBe(true);
      expect(dhlForYou.value.hasFeature(CarrierSetting.AllowMondayDelivery)).toBe(false);
    });

    it('can use hasDeliveryInCountry', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasDeliveryInCountry('NL')).toBe(true);
      expect(dhlForYou.value.hasDeliveryInCountry('NL')).toBe(true);
    });

    it('can use hasPickupInCountry', async () => {
      expect.assertions(2);

      const postNl = useFullCarrier(CarrierName.PostNl, PlatformName.MyParcel);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou, PlatformName.MyParcel);

      await loadCarriers();
      expect(postNl.value.hasPickupInCountry('BE')).toBe(true);
      expect(dhlForYou.value.hasPickupInCountry('BE')).toBe(false);
    });
  });
});
