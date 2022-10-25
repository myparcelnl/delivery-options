import {CARRIERS, CarrierName, PlatformName} from '@myparcel/sdk';
import {AbstractCarrierConfiguration} from './abstractCarrierConfiguration';
import {BpostCarrierConfiguration} from './bpostCarrierConfiguration';
import {CheapCargoCarrierConfiguration} from './cheapCargoCarrierConfiguration';
import {DhlCarrierConfiguration} from './dhlCarrierConfiguration';
import {DpdCarrierConfiguration} from './dpdCarrierConfiguration';
import {InstaboxCarrierConfiguration} from './instaboxCarrierConfiguration';
import {PostNlCarrierConfiguration} from './postNlCarrierConfiguration';
import {memoize} from 'lodash-unified';

const carrierConfiguration = memoize((carrierName: CarrierName, platform: PlatformName) => {
  switch (carrierName) {
    case CARRIERS.BPOST_NAME:
      return new BpostCarrierConfiguration(platform);

    case CARRIERS.CHEAP_CARGO_NAME:
      return new CheapCargoCarrierConfiguration(platform);

    case CARRIERS.DHL_NAME:
      return new DhlCarrierConfiguration(platform);

    case CARRIERS.DPD_NAME:
      return new DpdCarrierConfiguration(platform);

    case CARRIERS.POST_NL_NAME:
      return new PostNlCarrierConfiguration(platform);

    case CARRIERS.INSTABOX_NAME:
      return new InstaboxCarrierConfiguration(platform);

    default:
      throw new Error(`No configuration found for carrier ${carrierName}`);
  }
}, (carrierName: CarrierName, platform: PlatformName) => `${carrierName}_${platform}`);

export class CarrierConfigurationFactory {
  public static create(carrierName: CarrierName, platform: PlatformName): AbstractCarrierConfiguration {
    return carrierConfiguration(carrierName, platform);
  }
}
