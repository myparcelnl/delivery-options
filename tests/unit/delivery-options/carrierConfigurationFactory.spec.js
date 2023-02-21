import * as CARRIERS from '@/data/keys/carrierKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { MYPARCEL } from '@/data/keys/platformKeys';

describe('CarrierConfigurationFactory', () => {
  it.each(Object.values(CARRIERS))('should create a configuration for %s', (carrier) => {
    const config = CarrierConfigurationFactory.create(carrier, MYPARCEL);

    expect({
      name: config.getName(),
      features: config.getFeatures(),
      platformFeatures: config.getPlatformFeatures(),
      countriesForDelivery: config.getCountriesForDelivery(),
      countriesForPickup: config.getCountriesForPickup(),
    }).toMatchSnapshot();
  });

  it('throws error when requesting nonexistent carrier', () => {
    expect(() => CarrierConfigurationFactory.create('nonexistent-carrier')).toThrowError();
  });

  it('remembers the platform', () => {
    CarrierConfigurationFactory.create(CARRIERS.POSTNL, MYPARCEL);

    expect(() => CarrierConfigurationFactory.create(CARRIERS.POSTNL)).not.toThrow();
  });
});
