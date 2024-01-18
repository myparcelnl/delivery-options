import {type Ref} from 'vue';
import {asyncComputed, get, useMemoize} from '@vueuse/core';
import {type FullCarrier, getFullCarrier} from '@myparcel-do/shared';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are available in the current platform.
 */
export const useAvailableCarriers = useMemoize((): Ref<FullCarrier[]> => {
  const platform = useCurrentPlatform();

  return asyncComputed(
    () => {
      const {carriers} = get(platform.config);

      return Promise.all(
        carriers.map((carrier) => {
          return getFullCarrier(carrier.name, get(platform.name));
        }),
      );
    },
    undefined,
    {shallow: false},
  );
});
