import {type Ref} from 'vue';
import {asyncComputed, get} from '@vueuse/core';
import {type FullCarrier, getFullCarrier} from '@myparcel-do/shared';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are available in the current platform.
 */
export const useAvailableCarriers = (): Ref<FullCarrier[]> => {
  const platform = useCurrentPlatform();

  return asyncComputed(
    () => {
      return Promise.all(
        get(platform.config).carriers.map((carrier) => {
          return getFullCarrier(carrier.name, get(platform.name));
        }),
      );
    },
    undefined,
    {shallow: false},
  );
};
