import {computed} from 'vue';
import {get} from '@vueuse/core';
import {type ComputedRef} from '@vue/reactivity';
import {type CarrierIdentifier, resolveCarrierName, useCarriers, useDeliveryOptionsStore} from '@myparcel-do/shared';
import {type Carrier} from '@myparcel/sdk';

interface CarrierInstance extends Carrier {
  identifier: CarrierIdentifier;
}

export const useCurrentCarriers = (): ComputedRef<CarrierInstance[]> => {
  const deliveryOptionsStore = useDeliveryOptionsStore();
  const carrierQuery = useCarriers();

  return computed(() => {
    const carriers = get(carrierQuery.data);

    if (!carriers) {
      return [];
    }

    const configCarriers = Object.keys(deliveryOptionsStore.configuration.config?.carrierSettings ?? {});

    return configCarriers
      .map((carrierIdentifier) => {
        return {
          name: resolveCarrierName(carrierIdentifier),
          identifier: carrierIdentifier,
        };
      })
      .map(({name, identifier}) => {
        const matchingCarrier = carriers.find((carrier) => name === carrier.name);

        if (!matchingCarrier) {
          throw new Error(`Carrier ${identifier} not found`);
        }

        return {
          ...matchingCarrier,
          identifier,
        };
      });
  });
};
