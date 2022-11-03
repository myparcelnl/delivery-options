import * as CARRIERS from '@/data/keys/carrierKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { PACKAGE_TYPE_DIGITAL_STAMP, PACKAGE_TYPE_MAILBOX } from '@/data/keys/settingsConsts';

describe('CarrierConfiguration', () => {
  it('has a correct configuration', async() => {
    expect.assertions(6);
    const config = CarrierConfigurationFactory.create(CARRIERS.INSTABOX, MYPARCEL);

    expect(config.allowsPackageType(PACKAGE_TYPE_DIGITAL_STAMP)).toBe(false);
    expect(config.allowsPackageType(PACKAGE_TYPE_MAILBOX)).toBe(true);
    expect(config.allowsPackageType('NonExistentType')).toBe(false);
    expect(config.allowsDeliveryIn('FR')).toBe(false);
    expect(config.allowsDeliveryIn('NL')).toBe(true);
    expect(config.allowsPickupIn('NL')).toBe(false);
  });
});
