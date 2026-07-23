import {describe, it, expect, afterEach} from 'vitest';
import {useMockSdk} from '../__tests__/useMockSdk';
import {useCarriersRequest} from './sdk/useCarriersRequest';
import {setSdkBaseUrl, useSdk} from './useSdk';

describe('useSdk', () => {
  it('adds a user agent header', () => {
    const {clientConfig} = useMockSdk();

    useSdk();

    expect(clientConfig.value?.headers).toEqual({
      'X-User-Agent': `MyParcelDeliveryOptions/${__VERSION__}`,
    });

    // Make sure __VERSION__ actually returns a version string
    expect(clientConfig.value?.headers?.['X-User-Agent']).toMatch(/MyParcelDeliveryOptions\/\d+\.\d+\.\d+/);
  });

  describe('setSdkBaseUrl', () => {
    afterEach(() => {
      setSdkBaseUrl(undefined);
    });

    it('does not set a base url by default', () => {
      const {clientConfig} = useMockSdk();

      useSdk();

      expect(clientConfig.value?.baseUrl).toBeUndefined();
    });

    it('applies the base url to the sdk client', () => {
      const {clientConfig} = useMockSdk();

      setSdkBaseUrl('https://api.acceptance.myparcel.nl');
      useSdk();

      expect(clientConfig.value?.baseUrl).toBe('https://api.acceptance.myparcel.nl');
    });

    it('does not serve cached responses after the base url changes', async () => {
      const {history} = useMockSdk();

      const firstRequest = useCarriersRequest();
      await firstRequest.load();

      expect(history.value).toHaveLength(1);

      setSdkBaseUrl('https://api.acceptance.myparcel.nl');

      const secondRequest = useCarriersRequest();
      await secondRequest.load();

      expect(history.value).toHaveLength(2);
    });

    it('recreates the sdk client when the base url changes', () => {
      const {clientConfig} = useMockSdk();

      useSdk();

      expect(clientConfig.value?.baseUrl).toBeUndefined();

      setSdkBaseUrl('https://api.acceptance.myparcel.nl');
      useSdk();

      expect(clientConfig.value?.baseUrl).toBe('https://api.acceptance.myparcel.nl');
    });
  });
});
