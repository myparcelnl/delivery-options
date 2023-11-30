import {computed} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {getConfigKey} from '@myparcel/delivery-options/ts';
import {PlatformName} from '@myparcel/constants';
import {getPlatformConfig} from '../utils';
import {type SupportedPlatformName} from '../types';
import {useDeliveryOptionsStore} from '../stores';

export interface PlatformInstance {
  config: ComputedRef<ReturnType<typeof getPlatformConfig>>;
  features: ComputedRef<Set<string>>;
  name: ComputedRef<SupportedPlatformName>;
}

export const useCurrentPlatform = (): PlatformInstance => {
  const store = useDeliveryOptionsStore();

  const name = computed(() => {
    const {platform} = get(store.configuration)?.config ?? {};

    return platform ?? PlatformName.MyParcel;
  });

  const config = computed(() => getPlatformConfig(name.value));

  return {
    name,
    config,
    features: computed(() => {
      const deliveryTypes = config.value.carriers.flatMap((carrier) => carrier.deliveryTypes ?? []);
      const packageTypes = config.value.carriers.flatMap((carrier) => carrier.packageTypes ?? []);
      const shipmentOptions = config.value.carriers.flatMap((carrier) => carrier.shipmentOptions ?? []);

      const keys = [...deliveryTypes, ...packageTypes, ...shipmentOptions]
        .map(getConfigKey)
        .filter(Boolean) as string[];

      return new Set([
        ...keys,
        ...(config.value.features ?? []),
        ...config.value.carriers.flatMap((carrier) => carrier.features ?? []),
      ]);
    }),
  };
};
