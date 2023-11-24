/* eslint-disable max-nested-callbacks */
import {beforeEach, describe, expect, it} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {get} from '@vueuse/core';
import {FEATURE_SHOW_DELIVERY_DATE, useCarrierRequest} from '@myparcel-do/shared';
import {
  CarrierId,
  CarrierName,
  DeliveryTypeName,
  PackageTypeName,
  PlatformName,
  ShipmentOptionName,
} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {type UseCarrierConfiguration, useCarrierConfiguration} from './useCarrierConfiguration';

const allPlatforms = [PlatformName.MyParcel, PlatformName.SendMyParcel] satisfies SupportedPlatformName[];
const allCarriers = Object.values(CarrierName);

const matrix = allPlatforms.flatMap((platform) => {
  return allCarriers.map((carrier) => [carrier, platform]);
}) as [CarrierName, SupportedPlatformName][];

describe('useCarrierConfiguration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it.each(matrix)('returns the carrier configuration for "%s" on "%s"', (carrierName, platformName) => {
    let result: string | UseCarrierConfiguration['config'];

    try {
      const configuration = useCarrierConfiguration(carrierName, platformName);

      result = configuration.config;
    } catch (error) {
      // Not available on this platform
      result = '❌';
    }

    expect(result).toMatchSnapshot();
  });

  it('throws an error when a carrier is not found', () => {
    expect(() => useCarrierConfiguration('foo' as CarrierIdentifier)).toThrow('No configuration found for carrier foo');
  });

  it('resolves carrier by identifier', async () => {
    expect.assertions(1);

    const configuration = useCarrierConfiguration(`${CarrierName.PostNl}:12345`);

    // Wait for the carrier to load its data
    await useCarrierRequest(CarrierName.PostNl).load();

    expect(get(configuration.carrier)?.name).toBe(CarrierName.PostNl);
  });

  it('returns carrier data', async () => {
    expect.assertions(1);

    const configuration = useCarrierConfiguration(CarrierName.PostNl);

    // Wait for the carrier to load its data
    await useCarrierRequest(CarrierName.PostNl).load();

    expect(get(configuration.carrier)).toEqual({
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
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasPackageType(PackageTypeName.DigitalStamp)).toBe(true);
      expect(dhlForYou.hasPackageType(PackageTypeName.DigitalStamp)).toBe(false);
    });

    it('can use hasDeliveryType', () => {
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasDeliveryType(DeliveryTypeName.Morning)).toBe(true);
      expect(dhlForYou.hasDeliveryType(DeliveryTypeName.Morning)).toBe(false);
    });

    it('can use hasShipmentOption', () => {
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasShipmentOption(ShipmentOptionName.SameDayDelivery)).toBe(false);
      expect(dhlForYou.hasShipmentOption(ShipmentOptionName.SameDayDelivery)).toBe(true);
    });

    it('can use hasFeature', () => {
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasFeature(FEATURE_SHOW_DELIVERY_DATE)).toBe(true);
      expect(dhlForYou.hasFeature(FEATURE_SHOW_DELIVERY_DATE)).toBe(false);
    });

    it('can use hasDeliveryInCountry', () => {
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasDeliveryInCountry('NL')).toBe(true);
      expect(dhlForYou.hasDeliveryInCountry('NL')).toBe(true);
    });

    it('can use hasPickupInCountry', () => {
      const postNl = useCarrierConfiguration(CarrierName.PostNl);
      const dhlForYou = useCarrierConfiguration(CarrierName.DhlForYou);

      expect(postNl.hasPickupInCountry('BE')).toBe(true);
      expect(dhlForYou.hasPickupInCountry('BE')).toBe(false);
    });
  });
});
