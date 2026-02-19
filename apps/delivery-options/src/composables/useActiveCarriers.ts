import {computed, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type CarrierSettings,
  CarrierSetting,
  splitCarrierIdentifier,
  normalizeCarrierName,
  mapPackageTypeToCapability,
  mapCapabilityDeliveryType,
  useCapabilities,
  type SupportedDeliveryTypeName,
} from '@myparcel-dev/do-shared';
import {DeliveryTypeName} from '@myparcel-dev/constants';
import {getResolvedCarrier, getResolvedValue} from '../utils';
import {useAddressStore, useConfigStore} from '../stores';
import {type UseResolvedCarrier} from './useResolvedCarrier';

const DELIVERY_TYPES = [
  DeliveryTypeName.Standard,
  DeliveryTypeName.Express,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Morning,
];

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
  const {state: address} = useAddressStore();

  return computed(() => {
    const capPackageType = mapPackageTypeToCapability(config.packageType);
    const capabilities = useCapabilities(config.apiBaseUrl, address.cc, capPackageType);
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
        const cap = capabilities.getCarrierCapability(normalized);

        if (!cap) {
          return false;
        }

        // Check for delivery: carrier has non-pickup delivery types AND config allows it
        const hasDelivery =
          getResolvedValue(CarrierSetting.AllowDeliveryOptions, identifier) &&
          DELIVERY_TYPES.some((deliveryType) => {
            const capDeliveryTypes = cap.deliveryTypes
              .map(mapCapabilityDeliveryType)
              .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

            return capDeliveryTypes.includes(deliveryType);
          });

        // Check for pickup: carrier has PICKUP_DELIVERY AND config allows it
        const hasPickup =
          cap.deliveryTypes.includes('PICKUP_DELIVERY') &&
          Boolean(getResolvedValue(CarrierSetting.AllowPickupLocations, identifier));

        return hasDelivery || hasPickup;
      })
      .map(([identifier]) => {
        return getResolvedCarrier(identifier, address.cc, config.apiBaseUrl, capPackageType);
      });
  });
});
