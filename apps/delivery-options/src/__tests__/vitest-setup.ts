/* eslint-disable */
import {afterEach, vi} from 'vitest';
import {
  type AbstractPublicEndpoint,
  type EndpointResponse,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
  type Options,
} from '@myparcel/sdk';
import {cleanup} from '@testing-library/vue';
import {mockGetCarrier, mockGetCarriers} from '@myparcel-do/shared/testing';
import {mockGetDeliveryOptions, mockGetPickupLocations} from './mocks';

vi.mock('@myparcel/sdk', async (importOriginal) => {
  const original = await importOriginal<typeof import('@myparcel/sdk')>();

  return {
    ...original,
    FetchClient: class FetchClient extends original.FetchClient {
      public doRequest<E extends AbstractPublicEndpoint<any>>(endpoint: E, options: Options<E>): Promise<EndpointResponse<E>> {
        if (endpoint instanceof GetCarrier) {
          return Promise.resolve(mockGetCarrier(endpoint, options));
        }

        if (endpoint instanceof GetCarriers) {
          return Promise.resolve(mockGetCarriers(endpoint, options));
        }

        if (endpoint instanceof GetDeliveryOptions) {
          return Promise.resolve(mockGetDeliveryOptions(endpoint, options));
        }

        if (endpoint instanceof GetPickupLocations) {
          return Promise.resolve(mockGetPickupLocations(endpoint, options));
        }

        throw new Error(`Unknown request: ${endpoint.name}`);
      }
    },
  };
});

afterEach(() => {
  cleanup();
});
