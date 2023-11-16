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
  [CarrierName.Bpost as const]: BpostCarrierConfiguration,
  [CarrierName.Dhl as const]: DhlCarrierConfiguration,
  [CarrierName.DhlEuroPlus as const]: DhlEuroplusCarrierConfiguration,
  [CarrierName.DhlForYou as const]: DhlForYouCarrierConfiguration,
  [CarrierName.DhlParcelConnect as const]: DhlParcelConnectCarrierConfiguration,
  [CarrierName.Dpd as const]: DpdCarrierConfiguration,
  [CarrierName.PostNl as const]: PostNlCarrierConfiguration,
  [CarrierName.Ups as const]: UpsCarrierConfiguration,
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
