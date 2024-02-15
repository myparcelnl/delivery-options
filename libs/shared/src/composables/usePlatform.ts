import {computed, type MaybeRef, type ComputedRef} from 'vue';
import {get} from '@vueuse/core';
import {getPlatformConfig} from '../utils';
import {type PlatformOptions, type SupportedPlatformName} from '../types';

export interface UsePlatform {
  config: ComputedRef<PlatformOptions>;
}

export const usePlatform = (platformName: MaybeRef<SupportedPlatformName>): UsePlatform => {
  const config = computed(() => getPlatformConfig(get(platformName)));

  return {
    config,
  };
};
