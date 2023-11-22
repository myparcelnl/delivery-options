import {computed} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {type SupportedPlatformName, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {PlatformName} from '@myparcel/constants';
import {getPlatformConfig} from '../utils';

interface UseCurrentPlatform {
  config: ComputedRef<ReturnType<typeof getPlatformConfig>>;
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = (): UseCurrentPlatform => {
  const store = useDeliveryOptionsStore();

  const name = computed(() => {
    const {platform} = get(store.configuration)?.config ?? {};

    return platform ?? PlatformName.MyParcel;
  });

  return {
    name,
    config: computed(() => getPlatformConfig(name.value)),
  };
};
