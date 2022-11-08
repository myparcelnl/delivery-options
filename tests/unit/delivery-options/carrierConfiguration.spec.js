import * as CARRIERS from '@/data/keys/carrierKeys';
import { PACKAGE_TYPE_DIGITAL_STAMP, PACKAGE_TYPE_MAILBOX } from '@/data/keys/settingsConsts';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { MYPARCEL } from '@/data/keys/platformKeys';

describe('CarrierConfiguration', () => {
  it('(dis)allows delivery in', () => {
    const config = CarrierConfigurationFactory.create(CARRIERS.INSTABOX, MYPARCEL);

    expect(config.allowsDeliveryIn('FR')).toBe(false);
    expect(config.allowsDeliveryIn('NL')).toBe(true);
    expect(config.allowsPickupIn('NL')).toBe(false);
  });

  it('(dis)allows package type', () => {
    const config = CarrierConfigurationFactory.create(CARRIERS.INSTABOX, MYPARCEL);

    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_DIGITAL_STAMP, 'NL')).toBe(false);
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'NL')).toBe(true);
    expect(config.allowsPackageTypeIn(PACKAGE_TYPE_MAILBOX, 'BE')).toBe(false);
    expect(config.allowsPackageTypeIn('NonExistentType', 'NL')).toBe(false);
  });
});
