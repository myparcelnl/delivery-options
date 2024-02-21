import {toValue} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  resolveCarrierName,
  type CarrierSettings,
  splitCarrierIdentifier,
  computedAsync,
  type ComputedAsync,
} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {type ResolvedCarrier} from '../types';
import {useConfigStore} from '../stores';
import {useCurrentPlatform} from './useCurrentPlatform';

/**
 * Get the carriers that are currently active in the delivery options config.
 */
export const useActiveCarriers = useMemoize((): ComputedAsync<ResolvedCarrier[]> => {
  const config = useConfigStore();
  const platform = useCurrentPlatform();

  return computedAsync(async () => {
    const carrierNames = platform.config.value.carriers.map((carrier) => carrier.name);
    const entries = Object.entries(config.carrierSettings) as [CarrierIdentifier, CarrierSettings][];

    const sortedCarrierSettings = entries
      // Remove unsupported carriers
      .filter(([identifier]) => carrierNames.includes(resolveCarrierName(identifier)))
      // Sort carriers by the order in which they are defined in the config
      .sort(([identifierA], [identifierB]) => {
        const [nameA, subscriptionIdA] = splitCarrierIdentifier(identifierA);
        const [nameB, subscriptionIdB] = splitCarrierIdentifier(identifierB);

        if (nameA === nameB) {
          if (!subscriptionIdA || !subscriptionIdB) {
            return subscriptionIdA ? 1 : -1;
          }

          return subscriptionIdA.localeCompare(subscriptionIdB);
        }

        return carrierNames.indexOf(nameA) - carrierNames.indexOf(nameB);
      });

    const resolvedCarriers = await Promise.all(
      sortedCarrierSettings.map(([identifier]) => {
        return getResolvedCarrier(identifier, platform.name.value);
      }),
    );

    return resolvedCarriers.filter((carrier) => toValue(carrier.hasAnyDelivery) || toValue(carrier.hasPickup));
  });
});
