/* eslint-disable */
import {afterEach, vi, beforeEach} from 'vitest';
import type {ClientConfig} from '@myparcel/sdk';
import {type AbstractPublicEndpoint, type EndpointResponse, type Options} from '@myparcel/sdk';
import {cleanup} from '@testing-library/vue';
import {useRequestStorage} from '../composables';
import {useMockSdk} from './useMockSdk';
import {mockConsole, resetConsole} from './utils';

const { afterEachHooks } = vi.hoisted(() => {
  return {afterEachHooks: [] as (() => void)[]};
});

vi.mock('@myparcel/sdk', async (importOriginal) => {
  const original = await importOriginal<typeof import('@myparcel/sdk')>();

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
});

afterEach(() => {
  useRequestStorage().clear();
  useMockSdk().reset();

  afterEachHooks.forEach(hook => hook());

  cleanup();
  resetConsole();
});
