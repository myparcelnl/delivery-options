import {describe, it, expect, beforeEach} from 'vitest';
import {useMockSdk} from '@myparcel-dev/do-shared/testing';
import {useSdk, type DeliveryOptionsConfig} from '@myparcel-dev/do-shared';
import {useConfigStore} from './useConfigStore';

const ACCEPTANCE_URL = 'https://api.acceptance.myparcel.nl';

describe('useConfigStore', () => {
  beforeEach(() => {
    useConfigStore().reset();
  });

  it('applies apiBaseUrl to the sdk client', () => {
    const {clientConfig} = useMockSdk();

    useConfigStore().update({apiBaseUrl: ACCEPTANCE_URL} as DeliveryOptionsConfig);
    useSdk();

    expect(clientConfig.value?.baseUrl).toBe(ACCEPTANCE_URL);
  });

  it('restores the default sdk base url on reset', () => {
    const {clientConfig} = useMockSdk();

    useConfigStore().update({apiBaseUrl: ACCEPTANCE_URL} as DeliveryOptionsConfig);
    useConfigStore().reset();
    useSdk();

    expect(clientConfig.value?.baseUrl).toBe('https://api.myparcel.nl');
  });
});
