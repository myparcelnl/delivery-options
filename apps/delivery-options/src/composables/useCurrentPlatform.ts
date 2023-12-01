import {computed} from 'vue';
import {type ComputedRef} from '@vue/reactivity';
import {type ResolvedPlatform, type SupportedPlatformName, useResolvedPlatform} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {useConfigStore} from '../stores';

export interface PlatformInstance extends ResolvedPlatform {
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = (): PlatformInstance => {
  const config = useConfigStore();

  const name = computed<SupportedPlatformName>(() => {
    return config.platform ?? PlatformName.MyParcel;
  });

  return {
    name,
    ...useResolvedPlatform(name),
  };
};
