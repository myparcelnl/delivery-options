import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type CarrierSettings,
  splitCarrierIdentifier,
  normalizeCarrierName,
} from '@myparcel-dev/do-shared';
import {getResolvedCarrier, hasDeliveryForCarrier, hasPickupForCarrier} from '../utils';
import {useConfigStore} from '../stores';
import {type UseResolvedCarrier} from './useResolvedCarrier';
import {useBroadCapabilities} from './useBroadCapabilities';

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

  const capabilities = useBroadCapabilities();

  // eslint-disable-next-line max-lines-per-function
  return computed(() => {
    const entries = Object.entries(config.carrierSettings) as [CarrierIdentifier, CarrierSettings][];

    const sortedCarrierSettings = entries
      // Sort by order in MyParcelConfig carrierSettings keys, then by subscription ID
      .sort(([identifierA], [identifierB]) => {
        const [nameA, subscriptionIdA] = splitCarrierIdentifier(identifierA);
        const [nameB, subscriptionIdB] = splitCarrierIdentifier(identifierB);

        if (nameA === nameB) {
          if (!subscriptionIdA || !subscriptionIdB) {
            return subscriptionIdA ? 1 : -1;
          }

          return subscriptionIdA.localeCompare(subscriptionIdB);
        }

        // Sort by order in which they appear in config.carrierSettings
        const configKeys = Object.keys(config.carrierSettings);
        const indexA = configKeys.findIndex(
          // eslint-disable-next-line max-nested-callbacks
          (k) => normalizeCarrierName(k.split(':')[0] ?? k) === normalizeCarrierName(nameA),
        );
        const indexB = configKeys.findIndex(
          // eslint-disable-next-line max-nested-callbacks
          (k) => normalizeCarrierName(k.split(':')[0] ?? k) === normalizeCarrierName(nameB),
        );

        return indexA - indexB;
      });

    return sortedCarrierSettings
      .filter(([identifier]) => {
        const carrierPart = identifier.split(':')[0] ?? identifier;
        const normalized = normalizeCarrierName(carrierPart);
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
