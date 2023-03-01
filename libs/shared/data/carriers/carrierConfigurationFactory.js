import * as CARRIERS from '@/data/keys/carrierKeys';
import { BpostCarrierConfiguration } from '@/data/carriers/bpostCarrierConfiguration';
import { DhlCarrierConfiguration } from '@/data/carriers/dhlCarrierConfiguration';
import { DhlEuroplusCarrierConfiguration } from '@/data/carriers/dhlEuroplusCarrierConfiguration';
import { DhlForYouCarrierConfiguration } from '@/data/carriers/dhlForYouCarrierConfiguration';
import { DhlParcelConnectCarrierConfiguration } from '@/data/carriers/dhlParcelConnectCarrierConfiguration';
import { DpdCarrierConfiguration } from '@/data/carriers/dpdCarrierConfiguration';
import { PostNlCarrierConfiguration } from '@/data/carriers/postNlCarrierConfiguration';
import memoize from 'lodash-es/memoize';

const carrierConfiguration = memoize((carrierName, platform) => {
  switch (carrierName) {
    case CARRIERS.BPOST:
      return new BpostCarrierConfiguration(platform);
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
    default:
      throw new Error(`No configuration found for carrier ${carrierName}`);
  }
}, (carrierName, platform) => `${carrierName}_${platform}`);

export class CarrierConfigurationFactory {
  /**
   * @type {MyParcel.Platform|null}
   */
  platform = null;

  /**
   * @param {MyParcel.CarrierName} carrierName
   * @param {MyParcel.Platform|null} platform
   *
   * @returns {AbstractCarrierConfiguration}
   */
  static create(carrierName, platform = null) {
    this.platform = platform ?? this.platform;

    return carrierConfiguration(carrierName, this.platform);
  }
}
