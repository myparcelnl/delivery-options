import {describe, expect, it} from 'vitest';
import {
  AbstractCarrierConfiguration,
  FEATURES_DELIVERY,
  FEATURES_PACKAGE_TYPE_MAILBOX,
  FEATURES_PICKUP,
  FEATURES_SATURDAY_DELIVERY,
  PACKAGE_TYPE_DIGITAL_STAMP,
  PACKAGE_TYPE_MAILBOX,
} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';

class MockEmptyCarrierConfiguration extends AbstractCarrierConfiguration {}

class MockCarrierConfiguration extends AbstractCarrierConfiguration {
  getCountriesForDelivery() {
    return ['NL', 'BE'];
  }

  getCountriesForPickup() {
    return ['BE', 'FR', 'DE'];
  }

  getFeatures() {
    return {
      [PlatformName.MyParcel]: [FEATURES_DELIVERY, FEATURES_PICKUP, FEATURES_PACKAGE_TYPE_MAILBOX],
    };
  }

  getName() {
    return 'mock';
  }
}

describe.skip('CarrierConfiguration', () => {
  const config = new MockCarrierConfiguration(PlatformName.MyParcel);

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
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'BE')).toBe(false);
    expect(config.allowsPackageTypeIn('NonExistentType', 'NL')).toBe(false);
  });

  it('checks if feature is allowed', () => {
    expect(config.hasFeature(FEATURES_PACKAGE_TYPE_MAILBOX)).toBe(true);
    expect(config.hasFeature(FEATURES_SATURDAY_DELIVERY)).toBe(false);
  });

  it('throws an error when name is not implemented', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(PlatformName.MyParcel);
    expect(() => emptyConfig.getName()).toThrow();
  });

  it('has default features', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(PlatformName.MyParcel);
    expect(emptyConfig.getFeatures()).toEqual({});
  });

  it('has default countries for delivery', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(PlatformName.MyParcel);
    expect(emptyConfig.getCountriesForDelivery()).toEqual([]);
  });

  it('has default countries for pickup', () => {
    const emptyConfig = new MockEmptyCarrierConfiguration(PlatformName.MyParcel);
    expect(emptyConfig.getCountriesForPickup()).toEqual([]);
  });
});
