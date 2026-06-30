import {ref, nextTick} from 'vue';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {flushPromises} from '@vue/test-utils';
import {mockCapabilitiesFetch} from '@myparcel-dev/do-shared/testing';
import {type CapabilitiesRequest} from '../../types';
import {useReactiveCapabilitiesRequest} from './useCapabilitiesRequest';

const PROXY_URL = 'https://proxy.example.com/capabilities';

describe('useReactiveCapabilitiesRequest', () => {
  beforeEach(() => {
    mockCapabilitiesFetch.mockClear();
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
});
