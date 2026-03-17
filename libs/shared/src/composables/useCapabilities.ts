import {computed, ref, watch, type Ref, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {normalizeCarrierName} from '../utils';
import {type CarrierCapability, type CapabilitiesRequest, type CapabilitiesResponse} from '../types';
import {useCapabilitiesRequest, useReactiveCapabilitiesRequest} from './sdk';

export interface UseCapabilities {
  capabilities: Ref<CapabilitiesResponse>;
  getCarrierCapability(carrierIdentifier: string): CarrierCapability | undefined;
  availableCarrierNames: ComputedRef<string[]>;
  loading: ComputedRef<boolean>;
}

const EMPTY_RESPONSE: CapabilitiesResponse = {results: [] as CarrierCapability[]};

export const useCapabilities = useMemoize(
  (apiBaseUrl: string, countryCode: string, packageType?: string): UseCapabilities => {
    const capabilities = ref<CapabilitiesResponse>(EMPTY_RESPONSE);
    const loading = ref(true);

    const request = useCapabilitiesRequest(apiBaseUrl, {
      recipient: {countryCode},
      ...(packageType ? {packageType} : {}),
    });

    watch(
      () => request.data.value,
      (data) => {
        if (data) {
          capabilities.value = data as CapabilitiesResponse;
          loading.value = false;
        }
      },
      {immediate: true},
    );

    const getCarrierCapability = (carrierIdentifier: string): CarrierCapability | undefined => {
      const normalized = normalizeCarrierName(carrierIdentifier);

      return capabilities.value.results.find((cap) => normalizeCarrierName(cap.carrier) === normalized);
    };

    const availableCarrierNames = computed(() => {
      return capabilities.value.results.map((cap) => normalizeCarrierName(cap.carrier));
    });

    return {
      capabilities,
      getCarrierCapability,
      availableCarrierNames,
      loading: computed(() => loading.value),
    };
  },
);

const createCapabilitiesInterface = (
  capabilities: Ref<CapabilitiesResponse>,
  loading: Ref<boolean> | ComputedRef<boolean>,
): UseCapabilities => {
  const getCarrierCapability = (carrierIdentifier: string): CarrierCapability | undefined => {
    const normalized = normalizeCarrierName(carrierIdentifier);

    return capabilities.value.results.find((cap) => normalizeCarrierName(cap.carrier) === normalized);
  };

  const availableCarrierNames = computed(() => {
    return capabilities.value.results.map((cap) => normalizeCarrierName(cap.carrier));
  });

  return {
    capabilities,
    getCarrierCapability,
    availableCarrierNames,
    loading: computed(() => loading.value),
  };
};

/**
 * Reactive capabilities that re-fetch when the request ref changes.
 * Not memoized — caller is responsible for managing the instance lifecycle.
 */
export const useReactiveCapabilities = (
  apiBaseUrl: string,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
): UseCapabilities => {
  const {data, loading} = useReactiveCapabilitiesRequest(apiBaseUrl, requestRef);

  return createCapabilitiesInterface(data, loading);
};
