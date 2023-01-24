import {CARRIERS} from '../../data';
import { CarrierConfigurationFactory } from '../../data/carriers/carrierConfigurationFactory';
import { MYPARCEL } from '../../data/keys/platformKeys';

describe('CarrierConfigurationFactory', () => {
  it.each`
    carrier
    ${CARRIERS.POSTNL}
    ${CARRIERS.BPOST}
    ${CARRIERS.DPD}
    ${CARRIERS.DHL_FOR_YOU}
    ${CARRIERS.DPD}
    ${CARRIERS.INSTABOX}
    ${CARRIERS.DHL_EUROPLUS}
    ${CARRIERS.DHL_PARCEL_CONNECT}
  `('should create a configuration for $carrier', ({ carrier }) => {
    const config = CarrierConfigurationFactory.create(carrier, MYPARCEL);

    expect(config).toBeDefined();
  });
});
