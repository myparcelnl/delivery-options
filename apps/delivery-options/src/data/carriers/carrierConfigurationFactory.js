import {CARRIERS} from '../../data';
import { BpostCarrierConfiguration } from './bpostCarrierConfiguration';
import { CheapCargoCarrierConfiguration } from './cheapCargoCarrierConfiguration';
import { DhlCarrierConfiguration } from './dhlCarrierConfiguration';
import { DhlEuroplusCarrierConfiguration } from './dhlEuroplusCarrierConfiguration';
import { DhlForYouCarrierConfiguration } from './dhlForYouCarrierConfiguration';
import { DhlParcelConnectCarrierConfiguration } from './dhlParcelConnectCarrierConfiguration';
import { DpdCarrierConfiguration } from './dpdCarrierConfiguration';
import { InstaboxCarrierConfiguration } from './instaboxCarrierConfiguration';
import { PostNlCarrierConfiguration } from './postNlCarrierConfiguration';
import{ memoize } from 'lodash-unified';

const carrierConfiguration = memoize((carrierName, platform) => {
  switch (carrierName) {
    case CARRIERS.BPOST:
      return new BpostCarrierConfiguration(platform);
    case CARRIERS.CHEAP_CARGO:
      return new CheapCargoCarrierConfiguration(platform);
    case CARRIERS.DHL:
      return new DhlCarrierConfiguration(platform);
    case CARRIERS.DHL_FOR_YOU:
      return new DhlForYouCarrierConfiguration(platform);
    case CARRIERS.DHL_PARCEL_CONNECT:
      return new DhlParcelConnectCarrierConfiguration(platform);
    case CARRIERS.DHL_EUROPLUS:
      return new DhlEuroplusCarrierConfiguration(platform);
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
