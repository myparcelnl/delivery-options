import {
  FEATURES_DELIVERY,
  FEATURES_PACKAGE_TYPE_MAILBOX,
  FEATURES_PICKUP,
  FEATURES_SATURDAY_DELIVERY, FEATURES_PACKAGE_TYPE_PACKAGE_SMALL,
} from '@/data/carrierFeatures';
import { PACKAGE_TYPE_DIGITAL_STAMP, PACKAGE_TYPE_MAILBOX, PACKAGE_TYPE_PACKAGE_SMALL } from '@/data/keys/settingsConsts';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';

class MockEmptyCarrierConfiguration extends AbstractCarrierConfiguration {}

class MockCarrierConfiguration extends AbstractCarrierConfiguration {
  getName() {
    return 'mock';
  }

  getCountriesForDelivery() {
    return [
      'NL',
      'BE',
    ];
  }

  getCountriesForPickup() {
    return [
      'BE',
      'FR',
      'DE',
    ];
  }

  getFeatures() {
    return {
      [MYPARCEL]: [
        FEATURES_DELIVERY,
        FEATURES_PICKUP,
        FEATURES_PACKAGE_TYPE_MAILBOX,
        FEATURES_PACKAGE_TYPE_PACKAGE_SMALL,
      ],
    };
  }
}

describe('CarrierConfiguration', () => {
  const config = new MockCarrierConfiguration(MYPARCEL);

  it('(dis)allows delivery in', () => {
    expect(config.allowsDeliveryIn('BE')).toBe(true);
    expect(config.allowsDeliveryIn('FR')).toBe(false);
    expect(config.allowsDeliveryIn('NL')).toBe(true);
  });

  it('(dis)allows pickup in', () => {
    expect(config.allowsPickupIn('BE')).toBe(true);
    expect(config.allowsPickupIn('FR')).toBe(true);
    expect(config.allowsPickupIn('NL')).toBe(false);
  });

  it('(dis)allows package type', () => {
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_DIGITAL_STAMP, 'NL')).toBe(false);
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'NL')).toBe(true);
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'BE')).toBe(true);
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_PACKAGE_SMALL, 'NL')).toBe(true);
    expect(config.allowsPackageTypeIn('NonExistentType', 'NL')).toBe(false);
  });

  it('checks if feature is allowed', () => {
    expect(config.hasFeature(FEATURES_PACKAGE_TYPE_MAILBOX)).toBe(true);
    expect(config.hasFeature(FEATURES_SATURDAY_DELIVERY)).toBe(false);
  });

  it('throws an error when name is not implemented', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(MYPARCEL);
    expect(() => emptyConfig.getName()).toThrow();
  });

  it('has default features', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(MYPARCEL);
    expect(emptyConfig.getFeatures()).toEqual({});
  });

  it('has default countries for delivery', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(MYPARCEL);
    expect(emptyConfig.getCountriesForDelivery()).toEqual([]);
  });

  it('has default countries for pickup', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(MYPARCEL);
    expect(emptyConfig.getCountriesForPickup()).toEqual([]);
  });
});
