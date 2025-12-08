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

// Setup global fetch mock to catch ALL network requests
const originalFetch = global.fetch;

global.fetch = vi.fn(async (url: string | URL, options: RequestInit) => {
  const urlString = url.toString();
  // console.log('[Global Fetch Mock]', urlString);

  let mockResponse;

  try {
    if (urlString.includes('/carriers')) {
      // Handle carriers
      const carrierIdMatch = urlString.match(/\/carriers\/(\d+)/);
      if (carrierIdMatch) {
        // Single carrier
        const carrierId = Number(carrierIdMatch[1]);
        const endpoint = new GetCarrier(carrierId);
        mockResponse = await mockGetCarrier(endpoint, {path: {carrier: carrierId}});
      } else {
        // All carriers
        const endpoint = new GetCarriers();
        mockResponse = await mockGetCarriers(endpoint, {});
      }
    } else if (urlString.includes('/delivery_options')) {
      // Handle delivery options
      const endpoint = new GetDeliveryOptions();
      const queryParams = new URL(urlString).searchParams;
      const parameters = Object.fromEntries(queryParams.entries());
      mockResponse = await mockGetDeliveryOptions(endpoint, {parameters});
    } else if (urlString.includes('/pickup_locations')) {
      // Handle pickup locations
      const endpoint = new GetPickupLocations();
      const queryParams = new URL(urlString).searchParams;
      const parameters = Object.fromEntries(queryParams.entries());
      mockResponse = await mockGetPickupLocations(endpoint, {parameters});
    } else {
       console.warn('[Global Fetch Mock] Unhandled URL:', urlString);
       return new Response(JSON.stringify([]), {
        status: 404, 
        headers: {'Content-Type': 'application/json'}
      });
    }

    // Return proper JSON response
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('[Global Fetch Mock] Error processing request:', error);
    return new Response(JSON.stringify({errors: [{code: 500, message: String(error)}]}), {
      status: 500,
      headers: {'Content-Type': 'application/json'}
    });
  }
});

// Mock SDK to capture config, but rely on global.fetch for requests
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
