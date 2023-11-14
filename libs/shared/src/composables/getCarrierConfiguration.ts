import {useMemoize} from '@vueuse/core';
import {type CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {
  type AbstractCarrierConfiguration,
  BpostCarrierConfiguration,
  CARRIERS,
  DhlCarrierConfiguration,
  DhlEuroplusCarrierConfiguration,
  DhlForYouCarrierConfiguration,
  DhlParcelConnectCarrierConfiguration,
  DpdCarrierConfiguration,
  PostNlCarrierConfiguration,
  UpsCarrierConfiguration,
} from '../legacy';

const carrierClassMap = Object.freeze({
  [CARRIERS.BPOST]: BpostCarrierConfiguration,
  [CARRIERS.DHL]: DhlCarrierConfiguration,
  [CARRIERS.DHL_EUROPLUS]: DhlEuroplusCarrierConfiguration,
  [CARRIERS.DHL_FOR_YOU]: DhlForYouCarrierConfiguration,
  [CARRIERS.DHL_PARCEL_CONNECT]: DhlParcelConnectCarrierConfiguration,
  [CARRIERS.DPD]: DpdCarrierConfiguration,
  [CARRIERS.POSTNL]: PostNlCarrierConfiguration,
  [CARRIERS.UPS]: UpsCarrierConfiguration,
}) satisfies Readonly<Partial<Record<CarrierName, typeof AbstractCarrierConfiguration>>>;

export const getCarrierConfiguration = useMemoize(
  (carrierIdentifier: CarrierIdentifier, platform?: SupportedPlatformName) => {
    const [name, subscriptionId] = carrierIdentifier.split(':');

    if (carrierClassMap[name]) {
      return new carrierClassMap[name](platform, subscriptionId);
    }

    throw new Error(`No configuration found for carrier ${name}`);
  },
);
