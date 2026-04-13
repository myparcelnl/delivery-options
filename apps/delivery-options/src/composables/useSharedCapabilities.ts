import {computed, effectScope, type EffectScope} from 'vue';
import {
  type UseCapabilities,
  type CapabilitiesRequest,
  useReactiveCapabilities,
  mapPackageTypeToCapability,
} from '@myparcel-dev/do-shared';
import {useAddressStore, useConfigStore} from '../stores';

let instance: UseCapabilities | null = null;
let scope: EffectScope | null = null;

/**
 * Singleton reactive capabilities instance that re-fetches
 * when address or packageType changes.
 */
export const useSharedCapabilities = (): UseCapabilities => {
  if (!instance) {
    scope = effectScope();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    instance = scope.run(() => {
      const {state: config} = useConfigStore();
      const {state: address} = useAddressStore();

      /**
       * Request includes only session-scoped inputs: recipient address and
       * packageType (fixed by the integrating platform from the cart).
       * User-selectable fields (deliveryType, options, carrier) are intentionally
       * omitted — the backend returns the full option graph with only the shipment
       * options listed that are available, and the widget filters client-side to
       * avoid a network round-trip on every selection change.
       */
      const requestRef = computed<CapabilitiesRequest>(() => {
        const request: CapabilitiesRequest = {
          recipient: {
            countryCode: address.cc,
            ...(address.postalCode ? {postalCode: address.postalCode} : {}),
          },
        };

        const capPackageType = mapPackageTypeToCapability(config.packageType);

        if (capPackageType) {
          request.packageType = capPackageType;
        }

        return request;
      });

      const apiKeyRef = computed(() => config.apiKey);

      return useReactiveCapabilities(config.proxyCapabilities, requestRef, apiKeyRef);
    })!;
  }

  return instance;
};

/**
 * Reset the singleton (for app teardown / test cleanup).
 * Stops all reactive effects and clears data to prevent stale references
 * from triggering downstream reactive chains.
 */
export const resetSharedCapabilities = (): void => {
  if (instance) {
    instance.capabilities.value = {results: []};
  }

  if (scope) {
    scope.stop();
    scope = null;
  }

  instance = null;
};
