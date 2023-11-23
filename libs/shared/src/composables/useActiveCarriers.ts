import {type Ref} from 'vue';
import {asyncComputed, get} from '@vueuse/core';
import {getConfigCarriers} from '../utils';
import {type CarrierWithIdentifier} from '../types';
import {useCarriers} from '../sdk';

interface UseActiveCarriers {
  data: Ref<CarrierWithIdentifier[]>;
}

export const useActiveCarriers = (): UseActiveCarriers => {
  const carriers = useCarriers();
  const configCarriers = getConfigCarriers();

  return {
    data: asyncComputed(async () => {
      await carriers.load();

      return configCarriers.value
        .filter((carrier) => configCarriers.value.some((configCarrier) => configCarrier.name === carrier.name))
        .map((configCarrier) => {
          const carrier = get(carriers.data)?.find((carrier) => carrier.name === configCarrier.name);

          if (!carrier) {
            throw new Error(`Carrier ${configCarrier.name} not found`);
          }

          return {
            ...carrier,
            ...configCarrier,
          };
        });
    }),
  };
};
