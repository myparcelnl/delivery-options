import {computed, type MaybeRef} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {getConfigKey, getPlatformConfig} from '../utils';
import {type PlatformOptions, type SupportedPlatformName} from '../types';

export interface ResolvedPlatform {
  config: ComputedRef<PlatformOptions>;
  features: ComputedRef<Set<string>>;
}

export const useResolvedPlatform = (platformName: MaybeRef<SupportedPlatformName>): ResolvedPlatform => {
  const config = computed(() => getPlatformConfig(get(platformName)));

  const features = computed(() => {
    const deliveryTypes = config.value.carriers.flatMap((carrier) => carrier.deliveryTypes ?? []);
    const packageTypes = config.value.carriers.flatMap((carrier) => carrier.packageTypes ?? []);
    const shipmentOptions = config.value.carriers.flatMap((carrier) => carrier.shipmentOptions ?? []);

    const keys = [...deliveryTypes, ...packageTypes, ...shipmentOptions].map(getConfigKey).filter(Boolean) as string[];

    return new Set([
      ...keys,
      ...(config.value.features ?? []),
      ...config.value.carriers.flatMap((carrier) => carrier.features ?? []),
    ]);
  });

  return {
    config,
    features,
  };
};
