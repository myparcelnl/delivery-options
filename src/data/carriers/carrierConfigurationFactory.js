import * as CARRIERS from '@/data/keys/carrierKeys';
import { AbstractCarrierConfiguration } from './abstractCarrierConfiguration';
import { BpostCarrierConfiguration } from '@/data/carriers/bpostCarrierConfiguration';
import { DhlCarrierConfiguration } from '@/data/carriers/dhlCarrierConfiguration';
import { DhlEuroplusCarrierConfiguration } from '@/data/carriers/dhlEuroplusCarrierConfiguration';
import { DhlForYouCarrierConfiguration } from '@/data/carriers/dhlForYouCarrierConfiguration';
import { DhlParcelConnectCarrierConfiguration } from '@/data/carriers/dhlParcelConnectCarrierConfiguration';
import { DpdCarrierConfiguration } from '@/data/carriers/dpdCarrierConfiguration';
import { PostNlCarrierConfiguration } from '@/data/carriers/postNlCarrierConfiguration';
import { UpsCarrierConfiguration } from './upsCarrierConfiguration';
import memoize from 'lodash-es/memoize';

const carrierClassMap = Object.freeze({
  [CARRIERS.BPOST]: BpostCarrierConfiguration,
  [CARRIERS.DHL]: DhlCarrierConfiguration,
  [CARRIERS.DHL_EUROPLUS]: DhlEuroplusCarrierConfiguration,
  [CARRIERS.DHL_FOR_YOU]: DhlForYouCarrierConfiguration,
  [CARRIERS.DHL_PARCEL_CONNECT]: DhlParcelConnectCarrierConfiguration,
  [CARRIERS.DPD]: DpdCarrierConfiguration,
  [CARRIERS.POSTNL]: PostNlCarrierConfiguration,
  [CARRIERS.UPS]: UpsCarrierConfiguration,
});

const getCarrierConfiguration = memoize((carrierIdentifier, platform) => {
  const [name, subscriptionId] = carrierIdentifier.split(':');

  if (carrierClassMap[name]) {
    return new carrierClassMap[name](platform, subscriptionId);
  }

  throw new Error(`No configuration found for carrier ${name}`);
}, (carrierName, platform) => `${carrierName}_${platform}`);

export class CarrierConfigurationFactory {
  /**
   * @type {MyParcel.Platform|null}
   */
  platform = null;

  /**
   * @param {MyParcel.CarrierIdentifier} carrierIdentifier
   * @param {MyParcel.Platform|null} platform
   *
   * @returns {AbstractCarrierConfiguration}
   */
  static create(carrierIdentifier, platform = null) {
    this.platform = platform ?? this.platform;

    return getCarrierConfiguration(carrierIdentifier, this.platform);
  }
}
