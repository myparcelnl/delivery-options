import {computed} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {getConfigCarriers} from '../utils';
import {type DeliveryOptionsCarrier} from '../types';
import {useCarriers} from '../sdk';

interface UseActiveCarriers {
  data: ComputedRef<DeliveryOptionsCarrier[]>;
}

export const useActiveCarriers = (): UseActiveCarriers => {
  const allCarriers = useCarriers();
  const configCarriers = getConfigCarriers();

  return {
    data: computed(() => {
      return (
        getConfigCarriers()
          .filter((carrier) => configCarriers.some((configCarrier) => configCarrier.name === carrier.name))
          .map((configCarrier) => {
            const carrier = get(allCarriers.data)?.find((carrier) => carrier.name === configCarrier.name);

            if (!carrier) {
              throw new Error(`Carrier ${configCarrier.name} not found`);
            }

            return {
              ...carrier,
              ...configCarrier,
            };
          })
          // TODO: remove this slice
          .slice(0, 1)
      );
    }),
  };
};
