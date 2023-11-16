import {describe, expect, it} from 'vitest';
import {CARRIERS, getCarrierConfiguration} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

describe.skip('CarrierConfigurationFactory', () => {
  it.each(Object.values(CARRIERS))('should create a configuration for %s', (carrier) => {
    const config = getCarrierConfiguration(carrier, PlatformName.MyParcel);

    expect({
      name: config.getName(),
      features: config.getFeatures(),
      platformFeatures: config.getPlatformFeatures(),
      countriesForDelivery: config.getCountriesForDelivery(),
      countriesForPickup: config.getCountriesForPickup(),
    }).toMatchSnapshot();
  });

  it('throws error when requesting nonexistent carrier', () => {
    expect(() => getCarrierConfiguration('nonexistent-carrier')).toThrowError();
  });

  it('remembers the platform', () => {
    getCarrierConfiguration(CarrierName.PostNl, PlatformName.MyParcel);

    expect(() => getCarrierConfiguration(CarrierName.PostNl)).not.toThrow();
  });
});
