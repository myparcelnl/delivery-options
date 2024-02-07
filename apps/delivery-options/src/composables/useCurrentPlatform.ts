import {computed, type ComputedRef} from 'vue';
import {type ResolvedPlatform, type SupportedPlatformName, useResolvedPlatform} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

export interface PlatformInstance extends ResolvedPlatform {
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = (): PlatformInstance => {
  const config = useConfigStore();

  const name = computed<SupportedPlatformName>(() => config.platform);

  return {
    name,
    ...useResolvedPlatform(name),
  };
};
