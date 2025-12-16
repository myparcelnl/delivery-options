import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type UsePlatform, type SupportedPlatformName, usePlatform} from '@myparcel-dev/do-shared';
import {useSandboxStore} from '../stores';

export interface SandboxPlatformInstance extends UsePlatform {
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = useMemoize((): SandboxPlatformInstance => {
  const sandboxStore = useSandboxStore();
  const platformName = computed<SupportedPlatformName>(() => {
    return sandboxStore.platform;
  });

  return {
    name: platformName,
    ...usePlatform(platformName),
  };
});
