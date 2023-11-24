import {type Ref} from 'vue';
import {type FullCarrier} from '../utils/getFullCarriers';
import {useFullCarriers} from './useFullCarriers';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are available in the current platform.
 */
export const useAvailableCarriers = (): Ref<FullCarrier[]> => {
  const platform = useCurrentPlatform();

  return useFullCarriers(platform.config.value.carriers.map((carrier) => carrier.name));
};
