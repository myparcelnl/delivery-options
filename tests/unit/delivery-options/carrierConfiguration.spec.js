import {
  FEATURES_DELIVERY,
  FEATURES_PACKAGE_TYPE_MAILBOX,
  FEATURES_PICKUP,
  FEATURES_SATURDAY_DELIVERY,
} from '@/data/carrierFeatures';
import { PACKAGE_TYPE_DIGITAL_STAMP, PACKAGE_TYPE_MAILBOX } from '@/data/keys/settingsConsts';
import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { MYPARCEL } from '@/data/keys/platformKeys';

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
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'BE')).toBe(false);
    expect(config.allowsPackageTypeIn('NonExistentType', 'NL')).toBe(false);
  });

  it('checks if feature is allowed', () => {
    expect(config.hasFeature(FEATURES_PACKAGE_TYPE_MAILBOX)).toBe(true);
    expect(config.hasFeature(FEATURES_SATURDAY_DELIVERY)).toBe(false);
  });
});
