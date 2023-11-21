import {useMemoize} from '@vueuse/core';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';

export const getCarrierConfiguration = useMemoize(
  (carrierIdentifier: CarrierIdentifier, platform?: SupportedPlatformName) => {
    const [name, subscriptionId] = carrierIdentifier.split(':');

    if (carrierClassMap[name]) {
      return new carrierClassMap[name](platform, subscriptionId);
    }

    throw new Error(`No configuration found for carrier ${name}`);
  },
);
