import {
  ref,
  computed,
  watch,
  toValue,
  getCurrentScope,
  onScopeDispose,
  type MaybeRefOrGetter,
  type Ref,
  type ComputedRef,
} from 'vue';
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

const reportCapabilitiesError = (error: unknown): void => {
  useLogger().error('Capabilities request failed:', error);
  const {exceptions} = useApiExceptions();

  if (!exceptions.value.some((parsedError) => parsedError.code === 1)) {
    exceptions.value.push({
      code: 1,
      label: NO_DELIVERY_OPTIONS_AVAILABLE,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

const isAbortError = (error: unknown): boolean => error instanceof DOMException && error.name === 'AbortError';

export interface ReactiveCapabilitiesRequest {
  data: Ref<CapabilitiesResponse>;
  loading: Ref<boolean>;
  isWeightedResponse: ComputedRef<boolean>;
}

/**
 * Reactive capabilities request that re-fetches when the request ref changes.
 * Aborts stale in-flight requests. Deduplicates identical requests via JSON comparison.
 *
 * `proxyCapabilities` accepts a MaybeRefOrGetter so the URL is resolved at fetch
 * time, not at construction time. This is essential for hosts that mount the
 * widget *before* providing the config (e.g. Magento checkout fires the render
 * event with no detail, then sets `window.MyParcelConfig` later via an update).
 * Snapshotting the URL would otherwise pin the singleton to an empty string.
 */
// eslint-disable-next-line max-lines-per-function
export const useReactiveCapabilitiesRequest = (
  proxyCapabilities: MaybeRefOrGetter<string>,
  requestRef: Ref<CapabilitiesRequest> | ComputedRef<CapabilitiesRequest>,
  apiKey?: MaybeRefOrGetter<string | undefined>,
): ReactiveCapabilitiesRequest => {
  // Keep the response and its request scope together. Synchronous watchers must
  // never apply weighted contract rules to the previous, unweighted response.
  const response = ref({data: EMPTY_RESPONSE, weighted: false});
  const data = computed({
    get: () => response.value.data,
    set: (value: CapabilitiesResponse) => {
      response.value = {...response.value, data: value};
    },
  });
  const isWeightedResponse = computed(() => response.value.weighted);
  const loading = ref(true);
  let lastResponseJson = '';
  let abortController: AbortController | null = null;

  const doFetch = async () => {
    const request = toValue(requestRef);
    const currentApiKey = toValue(apiKey);
    const url = toValue(proxyCapabilities);

    abortController?.abort();
    const controller = new AbortController();

    abortController = controller;
    loading.value = true;

    // Skip fetch until both the URL and a destination country are known.
    // The watch below re-runs once the missing value becomes available.
    if (!url || !request.recipient?.countryCode) {
      // intentionally keep loading state
      return;
    }

    try {
      const result = await fetchCapabilities(url, request, currentApiKey, controller.signal);

      // Abort can occur after fetch resolves, while its response body is still being read.
      if (controller.signal.aborted) return;

      const weighted = Boolean(request.physicalProperties?.weight);
      const resultJson = JSON.stringify(result);

      // Only update when the response actually changed, to avoid triggering downstream watchers
      if (resultJson !== lastResponseJson || weighted !== response.value.weighted) {
        lastResponseJson = resultJson;
        response.value = {data: result, weighted};
      }
    } catch (error) {
      if (controller.signal.aborted || isAbortError(error)) {
        return;
      }

      response.value = {data: EMPTY_RESPONSE, weighted: false};
      lastResponseJson = '';
      reportCapabilitiesError(error);
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false;
      }
    }
  };

  // Watch a serialized version of the request *and* the resolved URL to avoid
  // false triggers from deep watch, while still re-fetching when the URL flips
  // from empty to a real value.
  const fetchKey = computed(() => `${toValue(proxyCapabilities)}|${JSON.stringify(toValue(requestRef))}`);

  // Initial fetch
  void doFetch();

  watch(
    fetchKey,
    () => {
      void doFetch();
    },
    {flush: 'sync'},
  );

  if (getCurrentScope()) {
    onScopeDispose(() => abortController?.abort());
  }

  return {data, loading, isWeightedResponse};
};
