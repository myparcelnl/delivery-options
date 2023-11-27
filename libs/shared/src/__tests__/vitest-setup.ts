/* eslint-disable */
import {vi} from 'vitest';
import {mockGetCarrier} from './mocks/mockGetCarrier';
import {mockGetCarriers} from './mocks/mockGetCarriers';
import {mockGetDeliveryOptions} from './mocks/mockGetDeliveryOptions';
import {mockGetPickupLocations} from './mocks/mockGetPickupLocations';
import {
  type AbstractPublicEndpoint,
  type EndpointResponse,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
  type Options,
} from '@myparcel/sdk';

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
