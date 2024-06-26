import {describe, it, expect} from 'vitest';
import {useMockSdk} from '../__tests__/useMockSdk';
import {useSdk} from './useSdk';

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
});
