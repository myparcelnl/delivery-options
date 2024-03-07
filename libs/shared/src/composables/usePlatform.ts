import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {getPlatformConfig, resolveCarrierName} from '../utils';
import {type PlatformConfiguration, type SupportedPlatformName, type CarrierIdentifier} from '../types';

export interface UsePlatform {
  config: ComputedRef<PlatformConfiguration>;
  hasCarrier(carrierIdentifier: CarrierIdentifier): boolean;
}

export const usePlatform = (platformName: MaybeRef<SupportedPlatformName>): UsePlatform => {
  const config = computed(() => getPlatformConfig(toValue(platformName)));

  return {
    config,
    hasCarrier(carrierIdentifier: CarrierIdentifier) {
      const carrierName = resolveCarrierName(carrierIdentifier);

      return config.value.carriers.some((carrier) => carrier.name === carrierName);
    },
  };
};
