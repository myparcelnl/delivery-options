import {computed, type ComputedRef} from 'vue';
import {type UsePlatform, type SupportedPlatformName, usePlatform} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';

export interface PlatformInstance extends UsePlatform {
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = (): PlatformInstance => {
  const {state: config} = useConfigStore();

  const name = computed<SupportedPlatformName>(() => config.platform);

  return {
    name,
    ...usePlatform(name),
  };
};
