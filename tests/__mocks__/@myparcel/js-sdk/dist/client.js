/* eslint-disable camelcase */
import { METHOD_SEARCH } from '@/delivery-options/data/request/fetchFromEndpoint';
import { fakeCarriersResponse } from './data/fakeCarriersResponse';
import { fakeDeliveryOptionsResponse } from './data/fakeDeliveryOptionsResponse';
import { fakePickupLocationsResponse } from './data/fakePickupLocationsResponse';

export const fakeResponses = {
  carriers: fakeCarriersResponse,
  delivery_options: fakeDeliveryOptionsResponse,
  pickup_locations: fakePickupLocationsResponse,
};

/**
 * Add a method returning a fake response wrapped in a promise.
 *
 * @param {String} method - Method to use.
 * @param {String} endpoint - Endpoint to use.
 *
 * @returns {Object<String, Function<Promise>>}
 */
const mock = (method, endpoint) => ({
  [method]: (...args) => {
    return Promise.resolve(fakeResponses[endpoint](...args));
  },
});

export default class Client {
  config = {
    acceptLanguage: null,
    url: null,
  };

  carriers = { ...mock(METHOD_SEARCH, 'carriers') };
  delivery_options = { ...mock(METHOD_SEARCH, 'delivery_options') };
  pickup_locations = { ...mock(METHOD_SEARCH, 'pickup_locations') };
}
