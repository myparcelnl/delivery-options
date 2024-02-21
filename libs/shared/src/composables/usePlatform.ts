import {computed, type MaybeRef, type ComputedRef, toValue} from 'vue';
import {getPlatformConfig} from '../utils';
import {type PlatformConfiguration, type SupportedPlatformName} from '../types';

export interface UsePlatform {
  config: ComputedRef<PlatformConfiguration>;
}

export const usePlatform = (platformName: MaybeRef<SupportedPlatformName>): UsePlatform => {
  const config = computed(() => getPlatformConfig(toValue(platformName)));

  return {
    config,
  };
};
