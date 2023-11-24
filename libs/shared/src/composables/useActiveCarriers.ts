import {type Ref} from 'vue';
import {type FullCarrier} from '../utils/getFullCarriers';
import {getConfigCarriers} from '../utils';
import {useFullCarriers} from './useFullCarriers';

/**
 * Get the carriers that are currently active in the delivery options config.
 */
export const useActiveCarriers = (): Ref<FullCarrier[]> => {
  const configCarriers = getConfigCarriers();
  const activeCarriers = configCarriers.value.map((carrier) => carrier.identifier);

  return useFullCarriers(activeCarriers);
};
