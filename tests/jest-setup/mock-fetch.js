import {
  ENDPOINTS,
  ENDPOINT_CARRIERS,
  ENDPOINT_DELIVERY_OPTIONS,
  ENDPOINT_PICKUP_LOCATIONS,
} from '@/delivery-options/data/endpoints';
import { fakeCarriersResponse } from '../mocks/fakeCarriersResponse';
import { fakeDeliveryOptionsResponse } from '../mocks/fakeDeliveryOptionsResponse';
import { fakePickupLocationsResponse } from '../mocks/fakePickupLocationsResponse';

global.fetch = jest.fn((url) => {
  const urlInstance = new URL(url);
  const endpoint = urlInstance.pathname.split('/').filter(Boolean)[0];
  const params = Object.fromEntries(urlInstance.searchParams.entries());

  let response = [];

  const matchingEndpoint = ENDPOINTS.find((endpointDefinition) => endpointDefinition.endpoint === endpoint);

  switch (endpoint) {
    case ENDPOINT_CARRIERS:
      response = fakeCarriersResponse(params);
      break;

    case ENDPOINT_DELIVERY_OPTIONS:
      response = fakeDeliveryOptionsResponse(params);
      break;

    case ENDPOINT_PICKUP_LOCATIONS:
      response = fakePickupLocationsResponse(params);
      break;

    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => {
      return Promise.resolve({
        data: {
          [matchingEndpoint?.property ?? matchingEndpoint?.endpoint ?? 'unknown']: response,
        },
      });
    },
  });
});
