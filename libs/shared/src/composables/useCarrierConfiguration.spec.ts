/* eslint-disable max-nested-callbacks */
import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {get} from '@vueuse/core';
import {
  CarrierId,
  CarrierName,
  DeliveryTypeName,
  PackageTypeName,
  PlatformName,
  ShipmentOptionName,
} from '@myparcel/constants';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';
import {useCarrierRequest} from '../sdk';
import {FEATURE_SHOW_DELIVERY_DATE} from '../data';
import {useFullCarrier} from './useFullCarrier';

const allPlatforms = [PlatformName.MyParcel, PlatformName.SendMyParcel] satisfies SupportedPlatformName[];
const allCarriers = Object.values(CarrierName);

const matrix = allPlatforms.flatMap((platform) => {
  return allCarriers.map((carrier) => [carrier, platform]);
}) as [CarrierName, SupportedPlatformName][];

describe('useFullCarrier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each(matrix)('returns the carrier configuration for "%s" on "%s"', (carrierName, platformName) => {
    let result: string | FullCarrier['config'];

    try {
      const configuration = useFullCarrier(carrierName, platformName);

      result = configuration.value.config;
    } catch (error) {
      // Not available on this platform
      result = '❌';
    }

    expect(result).toMatchSnapshot();
  });

  it('throws an error when a carrier is not found', () => {
    expect(() => useFullCarrier('foo' as CarrierIdentifier)).toThrow('No configuration found for carrier foo');
  });

  it('resolves carrier by identifier', async () => {
    expect.assertions(1);

    const configuration = useFullCarrier(`${CarrierName.PostNl}:12345`);

    // Wait for the carrier to load its data
    await useCarrierRequest(CarrierName.PostNl).load();

    expect(configuration.value.name).toBe(CarrierName.PostNl);
  });

  it('returns carrier data', async () => {
    expect.assertions(1);

    const configuration = useFullCarrier(CarrierName.PostNl);

    // Wait for the carrier to load its data
    await useCarrierRequest(CarrierName.PostNl).load();

    expect(get(configuration.value.carrier)).toEqual({
      id: CarrierId.PostNl,
      name: CarrierName.PostNl,
      human: 'PostNL',
      meta: {
        logo_png: '/skin/general-images/carrier-logos/postnl.png',
        logo_svg: '/skin/general-images/carrier-logos/svg/postnl.svg',
      },
    });
  });

  describe('exposes utility methods', () => {
    it('can use hasPackageType', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasPackageType(PackageTypeName.DigitalStamp)).toBe(true);
      expect(dhlForYou.value.hasPackageType(PackageTypeName.DigitalStamp)).toBe(false);
    });

    it('can use hasDeliveryType', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasDeliveryType(DeliveryTypeName.Morning)).toBe(true);
      expect(dhlForYou.value.hasDeliveryType(DeliveryTypeName.Morning)).toBe(false);
    });

    it('can use hasShipmentOption', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasShipmentOption(ShipmentOptionName.SameDayDelivery)).toBe(false);
      expect(dhlForYou.value.hasShipmentOption(ShipmentOptionName.SameDayDelivery)).toBe(true);
    });

    it('can use hasFeature', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasFeature(FEATURE_SHOW_DELIVERY_DATE)).toBe(true);
      expect(dhlForYou.value.hasFeature(FEATURE_SHOW_DELIVERY_DATE)).toBe(false);
    });

    it('can use hasDeliveryInCountry', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasDeliveryInCountry('NL')).toBe(true);
      expect(dhlForYou.value.hasDeliveryInCountry('NL')).toBe(true);
    });

    it('can use hasPickupInCountry', () => {
      const postNl = useFullCarrier(CarrierName.PostNl);
      const dhlForYou = useFullCarrier(CarrierName.DhlForYou);

      expect(postNl.value.hasPickupInCountry('BE')).toBe(true);
      expect(dhlForYou.value.hasPickupInCountry('BE')).toBe(false);
    });
  });
});
