import {describe, expect, it} from 'vitest';
import {CARRIERS, getCarrierConfiguration, MYPARCEL} from '@myparcel-do/shared';

describe('CarrierConfigurationFactory', () => {
  it.each(Object.values(CARRIERS))('should create a configuration for %s', (carrier) => {
    const config = getCarrierConfiguration(carrier, MYPARCEL);

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
    getCarrierConfiguration(CARRIERS.POSTNL, MYPARCEL);

    expect(() => getCarrierConfiguration(CARRIERS.POSTNL)).not.toThrow();
  });
});
