import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ResolvedPlatform, type SupportedPlatformName, useResolvedPlatform} from '@myparcel-do/shared';
import {useSandboxStore} from '../stores';

export interface SandboxPlatformInstance extends ResolvedPlatform {
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = useMemoize((): SandboxPlatformInstance => {
  const sandboxStore = useSandboxStore();
  const platformName = computed<SupportedPlatformName>(() => {
    return sandboxStore.platform;
  });

  return {
    name: platformName,
    ...useResolvedPlatform(platformName),
  };
});
