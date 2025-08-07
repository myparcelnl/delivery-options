import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {getPlatformConfig, resolveCarrierName} from '../utils';
import {type PlatformConfiguration, type SupportedPlatformName, type CarrierIdentifier} from '../types';

export interface UsePlatform {
  config: ComputedRef<PlatformConfiguration>;

  hasCarrier(carrierIdentifier: CarrierIdentifier): boolean;
}

export const usePlatform = (platformName: MaybeRef<SupportedPlatformName>): UsePlatform => {
  const config = computed(() => {
    const windowConfig = window.MyParcelConfig?.platformConfig;

    // Use window config if it exists and has carriers
    if (windowConfig && windowConfig.carriers && windowConfig.carriers.length > 0) {
      return windowConfig as PlatformConfiguration;
    }

    // Fall back to local platform config
    return getPlatformConfig(toValue(platformName));
  });

  return {
    config,
    hasCarrier(carrierIdentifier: CarrierIdentifier) {
      const carrierName = resolveCarrierName(carrierIdentifier);

      return config.value.carriers.some((carrier) => carrier.name === carrierName);
    },
  };
};
