import {
  ENDPOINTS,
  ENDPOINT_CARRIERS,
  ENDPOINT_DELIVERY_OPTIONS,
  ENDPOINT_PICKUP_LOCATIONS,
} from '@/delivery-options/data/endpoints';
import { fakeCarriersResponse } from '@Mocks/@myparcel/js-sdk/dist/data/fakeCarriersResponse';
import { fakeDeliveryOptionsResponse } from '@Mocks/@myparcel/js-sdk/dist/data/fakeDeliveryOptionsResponse';
import { fakePickupLocationsResponse } from '@Mocks/@myparcel/js-sdk/dist/data/fakePickupLocationsResponse';

global.fetch = jest.fn((args) => {
  const endpoint = args.split('?')[0].split('/').pop();
  let response = [];

  const matchingEndpoint = ENDPOINTS.find((endpointDefinition) => endpointDefinition.endpoint === endpoint);

  switch (endpoint) {
    case ENDPOINT_CARRIERS:
      response = fakeCarriersResponse();
      break;
    case ENDPOINT_DELIVERY_OPTIONS:
      response = fakeDeliveryOptionsResponse();
      break;
    case ENDPOINT_PICKUP_LOCATIONS:
      response = fakePickupLocationsResponse();
      break;
  }

  return Promise.resolve({
    json: () => Promise.resolve({
      data: {
        [matchingEndpoint.property ?? matchingEndpoint.endpoint ?? 'unknown']: response,
      },
    }),
  });
});
