import {computed, ref, watch, type Ref, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {normalizeCarrierName} from '../utils/capabilitiesMapping';
import {type CarrierCapability, type CapabilitiesResponse} from '../types';
import {useCapabilitiesRequest} from './sdk';

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
