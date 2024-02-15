import {computed, toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {useCarrier} from '@myparcel-do/shared';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are available in the current platform.
 */
export const useAvailableCarriers = useMemoize(() => {
  const platform = useCurrentPlatform();

  return computed(() => {
    const {carriers} = toValue(platform.config);

    return carriers.map((carrier) => {
      return useCarrier({carrierIdentifier: carrier.name, platformName: platform.name});
    });
  });
});
