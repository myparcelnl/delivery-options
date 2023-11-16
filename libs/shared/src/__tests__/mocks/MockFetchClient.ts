// noinspection SuspiciousTypeOfGuard

import {
  type AbstractPublicEndpoint,
  type EndpointResponse,
  FetchClient,
  GetCarrier,
  GetCarriers,
  GetDeliveryOptions,
  GetPickupLocations,
  type Options,
} from '@myparcel/sdk';
import {mockGetPickupLocations} from './mockGetPickupLocations';
import {mockGetDeliveryOptions} from './mockGetDeliveryOptions';
import {mockGetCarriers} from './mockGetCarriers';
import {mockGetCarrier} from './mockGetCarrier';

export class MockFetchClient extends FetchClient {
  public doRequest<E extends AbstractPublicEndpoint>(endpoint: E, options: Options<E>): Promise<EndpointResponse<E>> {
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
}
