import {ref, computed, watch, toValue, type MaybeRefOrGetter, type Ref, type ComputedRef} from 'vue';
import {useLogger} from '../useLogger';
import {EMPTY_RESPONSE} from '../useCapabilities';
import {type CapabilitiesRequest, type CapabilitiesResponse, type RequestHandler} from '../../types';
import {useRequest} from './useRequest';

const REQUEST_KEY_CAPABILITIES = 'capabilities';

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
    useLogger().warning('⚠️ Unsafe use of API key, do not use in production.');
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
// eslint-disable-next-line max-lines-per-function
export const useReactiveCapabilitiesRequest = (
  proxyCapabilities: string,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
  apiKey?: MaybeRefOrGetter<string | undefined>,
): ReactiveCapabilitiesRequest => {
  const data = ref<CapabilitiesResponse>(EMPTY_RESPONSE);
  const loading = ref(true);
  let lastRequestJson = '';
  let lastResponseJson = '';
  let abortController: AbortController | null = null;

  const doFetch = async () => {
    const request = toValue(requestRef);
    const currentApiKey = toValue(apiKey);
    const fetchKeyJson = JSON.stringify({request, apiKey: currentApiKey});

    if (fetchKeyJson === lastRequestJson) {
      return;
    }

    lastRequestJson = fetchKeyJson;

    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    loading.value = true;

    try {
      const result = await fetchCapabilities(proxyCapabilities, request, currentApiKey, abortController.signal);
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

      useLogger().error('Capabilities request failed:', error);
      data.value = EMPTY_RESPONSE;
      lastResponseJson = '';
    } finally {
      loading.value = false;
    }
  };

  // Watch a serialized version of the request + apiKey to avoid false triggers from deep watch
  const fetchKey = computed(() => JSON.stringify({request: toValue(requestRef), apiKey: toValue(apiKey)}));

  // Initial fetch
  void doFetch();

  watch(
    fetchKey,
    () => {
      void doFetch();
    },
    {flush: 'sync'},
  );

  return {data, loading};
};
