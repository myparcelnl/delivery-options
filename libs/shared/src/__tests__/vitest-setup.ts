/* eslint-disable */
import {afterEach, vi, beforeEach} from 'vitest';
import type {ClientConfig} from '@myparcel-dev/sdk';
import {type AbstractPublicEndpoint, type EndpointResponse, type Options} from '@myparcel-dev/sdk';
import {cleanup} from '@testing-library/vue';
import {useRequestStorage} from '../composables';
import {useMockSdk} from './useMockSdk';
import {mockConsole, resetConsole} from './utils';
import {mockCapabilitiesFetch} from './mocks/mockCapabilitiesResponse';

const { afterEachHooks } = vi.hoisted(() => {
  return {afterEachHooks: [] as (() => void)[]};
});

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

      public doRequest<E extends AbstractPublicEndpoint<any>>(endpoint: E, options: Options<E>): Promise<EndpointResponse<E>> {
        const {doRequest} = useMockSdk();

        return doRequest(endpoint, options);
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

  // Mock global.fetch for capabilities API requests
  vi.stubGlobal('fetch', mockCapabilitiesFetch);
});

afterEach(() => {
  useRequestStorage().clear();
  useMockSdk().reset();
  mockCapabilitiesFetch.mockClear();

  afterEachHooks.forEach(hook => hook());

  cleanup();
  resetConsole();
});
