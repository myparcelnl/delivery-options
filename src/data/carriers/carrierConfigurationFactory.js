import * as CARRIERS from '@/data/keys/carrierKeys';
import { BpostCarrierConfiguration } from '@/data/carriers/bpostCarrierConfiguration';
import { CheapCargoCarrierConfiguration } from '@/data/carriers/cheapCargoCarrierConfiguration';
import { DhlCarrierConfiguration } from '@/data/carriers/dhlCarrierConfiguration';
import { DpdCarrierConfiguration } from '@/data/carriers/dpdCarrierConfiguration';
import { PostNlCarrierConfiguration } from '@/data/carriers/postNlCarrierConfiguration';
import { RedJePakketjeCarrierConfiguration } from '@/data/carriers/redJePakketjeCarrierConfiguration';
import memoize from 'lodash-es/memoize';

const getMemoized = memoize((carrierName) => {
  switch (carrierName) {
    case CARRIERS.BPOST:
      return new BpostCarrierConfiguration();
    case CARRIERS.CHEAP_CARGO:
      return new CheapCargoCarrierConfiguration();
    case CARRIERS.DHL:
      return new DhlCarrierConfiguration();
    case CARRIERS.DPD:
      return new DpdCarrierConfiguration();
    case CARRIERS.POSTNL:
      return new PostNlCarrierConfiguration();
    case CARRIERS.RED_JE_PAKKETJE:
      return new RedJePakketjeCarrierConfiguration();
    default:
      throw new Error(`No configuration found for carrier ${carrierName}`);
  }
});

export class CarrierConfigurationFactory {
  /**
   * @param {MyParcel.CarrierName} carrierName
   *
   * @returns {Object}
   */
  static create(carrierName) {
    return getMemoized(carrierName);
  }
}
