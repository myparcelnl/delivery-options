import {computed, type MaybeRefOrGetter, type Ref, type ComputedRef} from 'vue';
import {normalizeCarrierName} from '../utils';
import {type CarrierCapability, type CapabilitiesRequest, type CapabilitiesResponse} from '../types';
import {useReactiveCapabilitiesRequest} from './sdk';

export interface UseCapabilities {
  capabilities: Ref<CapabilitiesResponse>;
  getCarrierCapability(carrierIdentifier: string, contractId?: number | null): CarrierCapability | undefined;
  availableCarrierNames: ComputedRef<string[]>;
  loading: ComputedRef<boolean>;
}

export const EMPTY_RESPONSE: CapabilitiesResponse = {results: [] as CarrierCapability[]};

/**
 * Reactive capabilities that re-fetch when the request ref changes.
 * Not memoized — caller is responsible for managing the instance lifecycle.
 *
 * `proxyCapabilities` accepts a MaybeRefOrGetter so the URL is resolved per
 * fetch — see useReactiveCapabilitiesRequest for the rationale.
 */
export const useReactiveCapabilities = (
  proxyCapabilities: MaybeRefOrGetter<string>,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
  apiKey?: MaybeRefOrGetter<string | undefined>,
): UseCapabilities => {
  const {data, loading, isWeightedResponse} = useReactiveCapabilitiesRequest(proxyCapabilities, requestRef, apiKey);

  const getCarrierCapability = (
    carrierIdentifier: string,
    contractId?: number | null,
  ): CarrierCapability | undefined => {
    const [carrierName, legacyContractId] = carrierIdentifier.split(':');
    const normalized = normalizeCarrierName(carrierName);
    const matches = data.value.results.filter((cap) => normalizeCarrierName(cap.carrier) === normalized);
    const selectedContractId = contractId ?? (legacyContractId ? Number(legacyContractId) : undefined);

    if (
      isWeightedResponse.value &&
      selectedContractId !== undefined &&
      matches.some((cap) => cap.contract?.id !== undefined)
    ) {
      return matches.find((cap) => cap.contract?.id === selectedContractId);
    }

    // Keep legacy requests and older proxies unchanged. A weighted response must
    // not borrow options from a different contract when the selected one is absent.
    return matches[0];
  };

  const availableCarrierNames = computed(() => {
    return data.value.results.map((cap) => normalizeCarrierName(cap.carrier));
  });

  return {
    capabilities: data,
    getCarrierCapability,
    availableCarrierNames,
    loading: computed(() => loading.value),
  };
};
