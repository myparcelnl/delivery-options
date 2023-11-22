import {describe, expect, it} from 'vitest';
import {get} from '@vueuse/core';
import {useCarrier} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {type UseCarrierConfiguration, useCarrierConfiguration} from './useCarrierConfiguration';

const allPlatforms = [PlatformName.MyParcel, PlatformName.SendMyParcel] satisfies SupportedPlatformName[];
const allCarriers = Object.values(CarrierName);

const matrix = allPlatforms.flatMap((platform) => {
  return allCarriers.map((carrier) => [carrier, platform]);
}) as [CarrierName, SupportedPlatformName][];

describe('useCarrierConfiguration', () => {
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
    const configuration = useCarrierConfiguration(`${CarrierName.PostNl}:12345`);

    // Wait for the carrier to load its data
    await useCarrier(CarrierName.PostNl).load();

    expect(get(configuration.carrier.data)?.name).toBe(CarrierName.PostNl);
  });
});
