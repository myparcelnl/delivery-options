import {useMemoize} from '@vueuse/core';
import {CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {
  type AbstractCarrierConfiguration,
  BpostCarrierConfiguration,
  DhlCarrierConfiguration,
  DhlEuroplusCarrierConfiguration,
  DhlForYouCarrierConfiguration,
  DhlParcelConnectCarrierConfiguration,
  DpdCarrierConfiguration,
  PostNlCarrierConfiguration,
  UpsCarrierConfiguration,
} from '../legacy';

const carrierClassMap = Object.freeze({
  [CarrierName.Bpost]: BpostCarrierConfiguration,
  [CarrierName.Dhl]: DhlCarrierConfiguration,
  [CarrierName.DhlEuroPlus]: DhlEuroplusCarrierConfiguration,
  [CarrierName.DhlForYou]: DhlForYouCarrierConfiguration,
  [CarrierName.DhlParcelConnect]: DhlParcelConnectCarrierConfiguration,
  [CarrierName.Dpd]: DpdCarrierConfiguration,
  [CarrierName.PostNl]: PostNlCarrierConfiguration,
  [CarrierName.Ups]: UpsCarrierConfiguration,
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
