import {ref, computed, watch, toValue, type Ref, type ComputedRef} from 'vue';
import {type CapabilitiesRequest, type CapabilitiesResponse, type RequestHandler} from '../../types';
import {useRequest} from './useRequest';

const REQUEST_KEY_CAPABILITIES = 'capabilities';

const EMPTY_RESPONSE: CapabilitiesResponse = {results: []};

const fetchCapabilities = async (
  proxyCapabilities: string,
  request: CapabilitiesRequest,
  apiKey?: string,
  signal?: AbortSignal,
): Promise<CapabilitiesResponse> => {
  const headers: Record<string, string> = {
    Accept: 'application/json;charset=utf-8;version=2.0',
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${btoa(apiKey)}`;
  }

  const response = await fetch(proxyCapabilities, {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Capabilities request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Static (memoized) capabilities request — used by useCarrier in shared lib.
 */
export const useCapabilitiesRequest = (
  proxyCapabilities: string,
  request: CapabilitiesRequest,
  apiKey?: string,
): RequestHandler<CapabilitiesResponse> => {
  return useRequest(
    [REQUEST_KEY_CAPABILITIES, request],
    () => fetchCapabilities(proxyCapabilities, request, apiKey, undefined),
    {
      fallback: EMPTY_RESPONSE,
    },
  );
};

export interface ReactiveCapabilitiesRequest {
  data: Ref<CapabilitiesResponse>;
  loading: Ref<boolean>;
}

/**
 * Reactive capabilities request that re-fetches when the request ref changes.
 * Aborts stale in-flight requests. Deduplicates identical requests via JSON comparison.
 */
export const useReactiveCapabilitiesRequest = (
  proxyCapabilities: string,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
  apiKey?: string,
): ReactiveCapabilitiesRequest => {
  const data = ref<CapabilitiesResponse>(EMPTY_RESPONSE);
  const loading = ref(true);
  let lastRequestJson = '';
  let lastResponseJson = '';
  let abortController: AbortController | null = null;

  const doFetch = async () => {
    const request = toValue(requestRef);
    const requestJson = JSON.stringify(request);

    if (requestJson === lastRequestJson) {
      return;
    }

    lastRequestJson = requestJson;

    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    loading.value = true;

    try {
      const result = await fetchCapabilities(proxyCapabilities, request, apiKey, abortController.signal);
      const resultJson = JSON.stringify(result);

      // Only update when the response actually changed, to avoid triggering downstream watchers
      if (resultJson !== lastResponseJson) {
        lastResponseJson = resultJson;
        data.value = result;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      console.error('Capabilities request failed:', error);
      data.value = EMPTY_RESPONSE;
      lastResponseJson = '';
    } finally {
      loading.value = false;
    }
  };

  // Watch a serialized version of the request to avoid false triggers from deep watch
  const requestJson = computed(() => JSON.stringify(toValue(requestRef)));

  // Initial fetch
  void doFetch();

  watch(requestJson, () => {
    void doFetch();
  });

  return {data, loading};
};
