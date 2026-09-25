import {computed, type MaybeRefOrGetter, type Ref, type ComputedRef} from 'vue';
import {normalizeCarrierName} from '../utils';
import {type CarrierCapability, type CapabilitiesRequest, type CapabilitiesResponse} from '../types';
import {useReactiveCapabilitiesRequest} from './sdk';

export interface UseCapabilities {
  capabilities: Ref<CapabilitiesResponse>;
  getCarrierCapability(carrierIdentifier: string): CarrierCapability | undefined;
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
  const {data, loading} = useReactiveCapabilitiesRequest(proxyCapabilities, requestRef, apiKey);

  const getCarrierCapability = (carrierIdentifier: string): CarrierCapability | undefined => {
    const normalized = normalizeCarrierName(carrierIdentifier);

    return data.value.results.find((cap) => normalizeCarrierName(cap.carrier) === normalized);
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
