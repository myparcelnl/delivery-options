import * as CARRIERS from '@/data/keys/carrierKeys';
import { BpostCarrierConfiguration } from '@/data/carriers/bpostCarrierConfiguration';
import { CheapCargoCarrierConfiguration } from '@/data/carriers/cheapCargoCarrierConfiguration';
import { DhlCarrierConfiguration } from '@/data/carriers/dhlCarrierConfiguration';
import { DpdCarrierConfiguration } from '@/data/carriers/dpdCarrierConfiguration';
import { InstaboxCarrierConfiguration } from '@/data/carriers/instaboxCarrierConfiguration';
import { PostNlCarrierConfiguration } from '@/data/carriers/postNlCarrierConfiguration';
import memoize from 'lodash-es/memoize';

const carrierConfiguration = memoize((carrierName, platform) => {
  switch (carrierName) {
    case CARRIERS.BPOST:
      return new BpostCarrierConfiguration(platform);
    case CARRIERS.CHEAP_CARGO:
      return new CheapCargoCarrierConfiguration(platform);
    case CARRIERS.DHL:
      return new DhlCarrierConfiguration(platform);
    case CARRIERS.DPD:
      return new DpdCarrierConfiguration(platform);
    case CARRIERS.POSTNL:
      return new PostNlCarrierConfiguration(platform);
    case CARRIERS.INSTABOX:
      return new InstaboxCarrierConfiguration(platform);
    default:
      throw new Error(`No configuration found for carrier ${carrierName}`);
  }
}, (carrierName, platform) => `${carrierName}_${platform}`);

export class CarrierConfigurationFactory {
  /**
   * @param {MyParcel.CarrierName} carrierName
   * @param {MyParcel.Platform} platform
   *
   * @returns {AbstractCarrierConfiguration}
   */
  static create(carrierName, platform) {
    return carrierConfiguration(carrierName, platform);
  }
}
