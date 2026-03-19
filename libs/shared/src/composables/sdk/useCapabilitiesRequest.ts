import {ref, computed, watch, toValue, type Ref, type ComputedRef} from 'vue';
import {type CapabilitiesRequest, type CapabilitiesResponse, type RequestHandler} from '../../types';
import {useRequest} from './useRequest';

const REQUEST_KEY_CAPABILITIES = 'capabilities';
const CAPABILITIES_BEARER_TOKEN = 'your_capabilities_bearer_token_here';

const EMPTY_RESPONSE: CapabilitiesResponse = {results: []};

const fetchCapabilities = async (
  apiBaseUrl: string,
  request: CapabilitiesRequest,
  signal?: AbortSignal,
): Promise<CapabilitiesResponse> => {
  const response = await fetch(`${apiBaseUrl}/shipments/capabilities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CAPABILITIES_BEARER_TOKEN}`,
      Accept: 'application/json;charset=utf-8;version=2.0',
      'Content-Type': 'application/json',
    },
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
  apiBaseUrl: string,
  request: CapabilitiesRequest,
): RequestHandler<CapabilitiesResponse> => {
  return useRequest([REQUEST_KEY_CAPABILITIES, request], () => fetchCapabilities(apiBaseUrl, request), {
    fallback: EMPTY_RESPONSE,
  });
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
  apiBaseUrl: string,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
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
      const result = await fetchCapabilities(apiBaseUrl, request, abortController.signal);
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
