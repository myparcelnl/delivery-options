import {ref, computed, watch, toValue, type MaybeRefOrGetter, type Ref, type ComputedRef} from 'vue';
import {useLogger} from '../useLogger';
import {EMPTY_RESPONSE} from '../useCapabilities';
import {useApiExceptions} from '../useApiExceptions';
import {type CapabilitiesRequest, type CapabilitiesResponse} from '../../types';
import {NO_DELIVERY_OPTIONS_AVAILABLE} from '../../data';

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
  let lastResponseJson = '';
  let abortController: AbortController | null = null;

  const doFetch = async () => {
    const request = toValue(requestRef);
    const currentApiKey = toValue(apiKey);

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

      const {exceptions} = useApiExceptions();

      if (!exceptions.value.some((parsedError) => parsedError.code === 1)) {
        exceptions.value.push({
          code: 1,
          label: NO_DELIVERY_OPTIONS_AVAILABLE,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    } finally {
      loading.value = false;
    }
  };

  // Watch a serialized version of the request to avoid false triggers from deep watch
  const fetchKey = computed(() => JSON.stringify(toValue(requestRef)));

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
