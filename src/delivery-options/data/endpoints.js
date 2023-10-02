export const METHOD_GET = 'get';

export const ACCEPT_JSON = 'application/json';

export const ENDPOINT_PICKUP_LOCATIONS = 'pickup_locations';
export const ENDPOINT_DELIVERY_OPTIONS = 'delivery_options';
export const ENDPOINT_CARRIERS = 'carriers';

export const HEADER_ACCEPT = 'Accept';
export const HEADER_ACCEPT_LANGUAGE = 'Accept-Language';
export const HEADER_USER_AGENT = 'X-User-Agent';

export const endpointDeliveryOptions = Object.freeze({
  endpoint: ENDPOINT_DELIVERY_OPTIONS,
  property: 'deliveries',
});

export const endpointPickupLocations = Object.freeze({
  endpoint: ENDPOINT_PICKUP_LOCATIONS,
});

export const endpointCarriers = Object.freeze({
  endpoint: ENDPOINT_CARRIERS,
});

export const ENDPOINTS = Object.freeze([
  endpointDeliveryOptions,
  endpointPickupLocations,
  endpointCarriers,
]);
