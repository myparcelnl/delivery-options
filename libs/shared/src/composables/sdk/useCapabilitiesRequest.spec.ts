import {ref, nextTick, effectScope} from 'vue';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {mockCapabilitiesFetch} from '@myparcel-dev/do-shared/testing';
import {useApiExceptions} from '../useApiExceptions';
import {type CapabilitiesRequest} from '../../types';
import {useReactiveCapabilitiesRequest} from './useCapabilitiesRequest';

const PROXY_URL = 'https://proxy.example.com/capabilities';

describe('useReactiveCapabilitiesRequest', () => {
  beforeEach(() => {
    mockCapabilitiesFetch.mockClear();
    // The exceptions ref lives at module level, so it survives between tests.
    useApiExceptions().clear();
  });

  it('fetches on creation and returns data', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {data, loading} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);

    expect(loading.value).toBe(true);

    await flushPromises();

    expect(loading.value).toBe(false);
    expect(data.value.results.length).toBeGreaterThan(0);
    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
  });

  it('calls fetch with correct URL, method, and headers (no auth header without apiKey)', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledWith(
      PROXY_URL,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Accept: 'application/json;charset=utf-8;version=2.0',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({recipient: {countryCode: 'NL'}}),
      }),
    );

    const callHeaders = (mockCapabilitiesFetch.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(callHeaders.Authorization).toBeUndefined();
  });

  it('includes Authorization header when apiKey is provided', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef, 'test-api-key');
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledWith(
      PROXY_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${btoa('test-api-key')}`,
        }),
      }),
    );
  });

  it('re-fetches when request ref changes', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(1);

    requestRef.value = {recipient: {countryCode: 'BE'}};
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(2);
  });

  it('skips fetch when request JSON is identical', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    // Set to the same value (new object, same JSON)
    requestRef.value = {recipient: {countryCode: 'NL'}};
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(1);
  });

  it('aborts previous in-flight request when params change', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');

    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);

    // Change before first request resolves
    requestRef.value = {recipient: {countryCode: 'BE'}};
    await nextTick();
    await flushPromises();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });

  it('resets to empty response on non-abort error', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {data} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    expect(data.value.results.length).toBeGreaterThan(0);

    // Make fetch fail
    mockCapabilitiesFetch.mockRejectedValueOnce(new Error('Network error'));

    requestRef.value = {recipient: {countryCode: 'DE'}};
    await nextTick();
    await flushPromises();

    expect(data.value.results).toEqual([]);
  });

  it('does not reset data on abort error', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {data} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    const dataBeforeAbort = data.value;

    // Make fetch throw an AbortError
    const abortError = new DOMException('The operation was aborted.', 'AbortError');

    mockCapabilitiesFetch.mockRejectedValueOnce(abortError);

    requestRef.value = {recipient: {countryCode: 'BE'}};
    await nextTick();
    await flushPromises();

    // Data should not have been reset to empty
    expect(data.value).toBe(dataBeforeAbort);
  });

  it('sets loading to false after fetch resolves', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {loading} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);

    expect(loading.value).toBe(true);

    await flushPromises();

    expect(loading.value).toBe(false);
  });

  it('sets loading to false after fetch rejects', async () => {
    mockCapabilitiesFetch.mockRejectedValueOnce(new Error('fail'));

    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {loading} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    expect(loading.value).toBe(false);
  });

  it('skips fetch while proxyCapabilities is empty and fetches once the URL is set', async () => {
    const urlRef = ref('');
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {loading} = useReactiveCapabilitiesRequest(urlRef, requestRef);

    await flushPromises();

    expect(mockCapabilitiesFetch).not.toHaveBeenCalled();
    expect(loading.value).toBe(true);

    urlRef.value = PROXY_URL;
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(mockCapabilitiesFetch).toHaveBeenCalledWith(PROXY_URL, expect.any(Object));
    expect(loading.value).toBe(false);
  });

  it('skips fetch while the country code is empty and fetches once it is set', async () => {
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: ''}});

    const {loading} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);

    await flushPromises();

    expect(mockCapabilitiesFetch).not.toHaveBeenCalled();
    expect(loading.value).toBe(true);

    requestRef.value = {recipient: {countryCode: 'NL'}};
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(loading.value).toBe(false);
  });

  it('skips fetch while the request has no recipient', async () => {
    // The type says recipient is always there, but hosts push partial data at runtime.
    const requestRef = ref<CapabilitiesRequest>({} as CapabilitiesRequest);

    const {loading} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);

    await flushPromises();

    expect(mockCapabilitiesFetch).not.toHaveBeenCalled();
    expect(loading.value).toBe(true);

    requestRef.value = {recipient: {countryCode: 'NL'}};
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(loading.value).toBe(false);
  });

  it('reports an exception when the response status is not ok', async () => {
    mockCapabilitiesFetch.mockResolvedValueOnce({ok: false, status: 503} as Response);

    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    const {data} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    expect(data.value.results).toEqual([]);

    const {exceptions} = useApiExceptions();

    expect(exceptions.value).toHaveLength(1);
    expect(exceptions.value[0].message).toBe('Capabilities request failed: 503');
  });

  it('keeps the same data object when the response did not change', async () => {
    // DE and FR are both unsupported in the mock, so both return an empty result set.
    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'DE'}});

    const {data} = useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    const dataAfterFirstFetch = data.value;

    requestRef.value = {recipient: {countryCode: 'FR'}};
    await nextTick();
    await flushPromises();

    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(2);
    expect(data.value).toBe(dataAfterFirstFetch);
  });

  it('reports a rejection that is not an Error', async () => {
    mockCapabilitiesFetch.mockRejectedValueOnce('kapot');

    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    const {exceptions} = useApiExceptions();

    expect(exceptions.value).toHaveLength(1);
    expect(exceptions.value[0].message).toBe('kapot');
  });

  it('adds the exception only once when the fetch fails again', async () => {
    mockCapabilitiesFetch.mockRejectedValueOnce(new Error('first failure'));

    const requestRef = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});

    useReactiveCapabilitiesRequest(PROXY_URL, requestRef);
    await flushPromises();

    mockCapabilitiesFetch.mockRejectedValueOnce(new Error('second failure'));

    requestRef.value = {recipient: {countryCode: 'BE'}};
    await nextTick();
    await flushPromises();

    const {exceptions} = useApiExceptions();

    expect(exceptions.value).toHaveLength(1);
    expect(exceptions.value[0].message).toBe('first failure');
  });

  it.each([400, 401, 422, 503])('does not retry without weight after HTTP %s', async (status) => {
    mockCapabilitiesFetch.mockResolvedValueOnce({ok: false, status} as Response);
    const {data, loading} = useReactiveCapabilitiesRequest(
      PROXY_URL,
      ref({recipient: {countryCode: 'NL'}, physicalProperties: {weight: {value: 30000, unit: 'g'}}}),
    );
    await flushPromises();
    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(data.value.results).toEqual([]);
    expect(loading.value).toBe(false);
    expect(useApiExceptions().exceptions.value).toHaveLength(1);
  });

  it('uses normal error handling for a weighted network failure', async () => {
    mockCapabilitiesFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const {data} = useReactiveCapabilitiesRequest(
      PROXY_URL,
      ref({recipient: {countryCode: 'NL'}, physicalProperties: {weight: {value: 30000, unit: 'g'}}}),
    );
    await flushPromises();
    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(data.value.results).toEqual([]);
    expect(useApiExceptions().exceptions.value).toHaveLength(1);
  });

  it('keeps a valid empty weighted response without retry or error', async () => {
    mockCapabilitiesFetch.mockResolvedValueOnce({ok: true, json: () => Promise.resolve({results: []})} as Response);
    const {data} = useReactiveCapabilitiesRequest(
      PROXY_URL,
      ref({recipient: {countryCode: 'NL'}, physicalProperties: {weight: {value: 40000, unit: 'g'}}}),
    );
    await flushPromises();
    expect(mockCapabilitiesFetch).toHaveBeenCalledOnce();
    expect(data.value.results).toEqual([]);
    expect(useApiExceptions().exceptions.value).toEqual([]);
  });

  it('ignores a stale response that completes after the latest weight response', async () => {
    let resolveOld: (value: Response) => void = () => undefined;
    mockCapabilitiesFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const request = ref<CapabilitiesRequest>({
      recipient: {countryCode: 'NL'},
      physicalProperties: {weight: {value: 30000, unit: 'g'}},
    });
    const {data, loading} = useReactiveCapabilitiesRequest(PROXY_URL, request);
    request.value = {recipient: {countryCode: 'NL'}, physicalProperties: {weight: {value: 15000, unit: 'g'}}};
    await flushPromises();
    const currentData = data.value;
    resolveOld({ok: true, json: () => Promise.resolve({results: []})} as Response);
    await flushPromises();
    expect(data.value).toBe(currentData);
    expect(data.value.results.length).toBeGreaterThan(0);
    expect(loading.value).toBe(false);
  });

  it('keeps loading for the latest request when an older request completes', async () => {
    let resolveOld: (value: Response) => void = () => undefined;
    let resolveCurrent: (value: Response) => void = () => undefined;
    mockCapabilitiesFetch
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOld = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveCurrent = resolve;
          }),
      );
    const request = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});
    const {loading} = useReactiveCapabilitiesRequest(PROXY_URL, request);
    request.value = {recipient: {countryCode: 'BE'}};
    resolveOld({ok: true, json: () => Promise.resolve({results: []})} as Response);
    await flushPromises();
    expect(loading.value).toBe(true);
    resolveCurrent({ok: true, json: () => Promise.resolve({results: []})} as Response);
    await flushPromises();
    expect(loading.value).toBe(false);
  });

  it('does not report errors from an obsolete weighted request', async () => {
    let rejectOld: (error: Error) => void = () => undefined;
    mockCapabilitiesFetch.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          rejectOld = reject;
        }),
    );
    const request = ref<CapabilitiesRequest>({
      recipient: {countryCode: 'NL'},
      physicalProperties: {weight: {value: 30000, unit: 'g'}},
    });
    const {data} = useReactiveCapabilitiesRequest(PROXY_URL, request);
    request.value = {recipient: {countryCode: 'NL'}};
    await flushPromises();
    rejectOld(new TypeError('Failed to fetch'));
    await flushPromises();
    expect(mockCapabilitiesFetch).toHaveBeenCalledTimes(2);
    expect(data.value.results.length).toBeGreaterThan(0);
    expect(useApiExceptions().exceptions.value).toEqual([]);
  });

  it.each(['dispose', 'clear country'])('ignores an in-flight response after %s', async (action) => {
    let resolveRequest: (value: Response) => void = () => undefined;
    mockCapabilitiesFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const scope = effectScope();
    const params = ref<CapabilitiesRequest>({recipient: {countryCode: 'NL'}});
    const request = scope.run(() => useReactiveCapabilitiesRequest(PROXY_URL, params));

    if (action === 'dispose') scope.stop();
    else params.value = {recipient: {countryCode: ''}};

    resolveRequest({ok: true, json: () => Promise.resolve({results: [{carrier: 'DPD'}]})} as Response);
    await flushPromises();
    expect(mockCapabilitiesFetch.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(request?.data.value.results).toEqual([]);
    scope.stop();
  });
});
