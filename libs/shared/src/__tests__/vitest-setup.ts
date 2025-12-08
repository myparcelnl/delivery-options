/* eslint-disable */
import {afterEach, vi, beforeEach} from 'vitest';
import type {ClientConfig} from '@myparcel-dev/sdk';
import {cleanup} from '@testing-library/vue';
import {useRequestStorage} from '../composables';
import {useMockSdk} from './useMockSdk';
import {mockConsole, resetConsole} from './utils';
import {mockGetCarrier, mockGetCarriers, mockGetDeliveryOptions, mockGetPickupLocations} from './mocks';
import {GetCarrier, GetCarriers, GetDeliveryOptions, GetPickupLocations} from '@myparcel-dev/sdk';

const { afterEachHooks } = vi.hoisted(() => {
  return {afterEachHooks: [] as (() => void)[]};
});

// Use SDK interceptor pattern instead of mocking fetch
// Intercept requests and return mock data
vi.mock('@myparcel-dev/sdk', async (importOriginal) => {
  const original = await importOriginal<typeof import('@myparcel-dev/sdk')>();

  return {
    ...original,
    FetchClient: class FetchClient extends original.FetchClient {
      constructor(config?: ClientConfig) {
        super(config);
        const {clientConfig} = useMockSdk();
        clientConfig.value = config;
      }
      
      public async doRequest(endpoint: any, options: any) {
        const name = endpoint.name;
        
        if (name === 'getCarrier') {
          return mockGetCarrier(endpoint, options);
        } else if (name === 'getCarriers') {
          return mockGetCarriers(endpoint, options);
        } else if (name === 'getDeliveryOptions') {
          return mockGetDeliveryOptions(endpoint, options);
        } else if (name === 'getPickupLocations') {
          return mockGetPickupLocations(endpoint, options);
        }
        
        // Unknown endpoint - return empty
        return [];
      }
    },
  };
});

vi.mock('@vueuse/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('@vueuse/core')>();

  return {
    ...original,
    useMemoize: vi.fn((...args: any[]) => {
      // @ts-expect-error todo
      let useMemoizeReturn = original.useMemoize(...args);

      afterEachHooks.push(() => useMemoizeReturn.clear());

      return useMemoizeReturn;
    }),
  };
});

beforeEach(() => {
  mockConsole();
});

afterEach(() => {
  useRequestStorage().clear();
  useMockSdk().reset();

  afterEachHooks.forEach(hook => hook());

  cleanup();
  resetConsole();
});
