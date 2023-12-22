import {describe, expect, it} from 'vitest';
import {CarrierName, PlatformName} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {SUPPORTED_PLATFORMS} from '../data/constants';
import {getCarrierConfiguration} from './getCarrierConfiguration';

describe('getCarrierConfiguration', () => {
  it.each([
    [PlatformName.MyParcel, CarrierName.PostNl],
    [PlatformName.SendMyParcel, CarrierName.PostNl],
    [PlatformName.MyParcel, `${CarrierName.PostNl}:12345`],
    [PlatformName.SendMyParcel, `${CarrierName.PostNl}:12345`],
  ] satisfies [SupportedPlatformName, CarrierIdentifier][])(
    'gets config for carrier %s on platform %s',
    (platform, carrier) => {
      const config = getCarrierConfiguration(carrier, platform);

      expect(config).toContain({
        name: CarrierName.PostNl,
      });
    },
  );

  it.each(SUPPORTED_PLATFORMS)('throws error on %s when no configuration is found', (platform) => {
    expect(() => {
      return getCarrierConfiguration('foo' as CarrierIdentifier, platform);
    }).toThrowError();
  });
});
