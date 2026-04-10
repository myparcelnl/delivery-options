import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type CarrierSettings,
  resolveCarrierName,
  splitCarrierIdentifier,
} from '@myparcel-dev/do-shared';
import {getResolvedCarrier, hasDeliveryForCarrier, hasPickupForCarrier} from '../utils';
import {useConfigStore} from '../stores';
import {useSharedCapabilities} from './useSharedCapabilities';
import {type UseResolvedCarrier} from './useResolvedCarrier';

/**
 * Get the carriers that are currently active in the delivery options config.
 * Uses the intersection of carriers from MyParcelConfig and capabilities API.
 *
 * Reads capabilities directly inside the computed (rather than relying on
 * getResolvedCarrier's hasDelivery/hasPickup computeds) to ensure a direct
 * reactive dependency on capabilities.value for reliable updates.
 */
// eslint-disable-next-line max-lines-per-function
export const useActiveCarriers = useMemoize((): ComputedRef<UseResolvedCarrier[]> => {
  const {state: config} = useConfigStore();

  const capabilities = useSharedCapabilities();

  // eslint-disable-next-line max-lines-per-function
  return computed(() => {
    const entries = Object.entries(config.carrierSettings) as [CarrierIdentifier, CarrierSettings][];

    // Build a carrier-name → index map once so sorting is O(n log n) instead of O(n² log n)
    const carrierOrderIndex = new Map<string, number>();
    Object.keys(config.carrierSettings).forEach((key, index) => {
      const name = resolveCarrierName(key as CarrierIdentifier);

      if (!carrierOrderIndex.has(name)) {
        carrierOrderIndex.set(name, index);
      }
    });

    const sortedCarrierSettings = entries
      .sort(([identifierA], [identifierB]) => {
        const [nameA, subscriptionIdA] = splitCarrierIdentifier(identifierA);
        const [nameB, subscriptionIdB] = splitCarrierIdentifier(identifierB);

        if (nameA === nameB) {
          if (!subscriptionIdA || !subscriptionIdB) {
            return subscriptionIdA ? 1 : -1;
          }

          return subscriptionIdA.localeCompare(subscriptionIdB);
        }

        return (carrierOrderIndex.get(nameA) ?? 0) - (carrierOrderIndex.get(nameB) ?? 0);
      });

    return sortedCarrierSettings
      .filter(([identifier]) => {
        const normalized = resolveCarrierName(identifier);
        const capability = capabilities.getCarrierCapability(normalized);

        if (!capability) {
          return false;
        }

        return hasDeliveryForCarrier(capability, identifier) || hasPickupForCarrier(capability, identifier);
      })
      .map(([identifier]) => {
        return getResolvedCarrier(identifier);
      });
  });
});
