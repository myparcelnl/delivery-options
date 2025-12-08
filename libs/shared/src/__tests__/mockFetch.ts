import {vi} from 'vitest';
import {mockGetCarrier, mockGetCarriers, mockGetDeliveryOptions, mockGetPickupLocations} from './mocks';
import {GetCarrier, GetCarriers, GetDeliveryOptions, GetPickupLocations} from '@myparcel-dev/sdk';

// Save original fetch
const originalFetch = global.fetch;

// Create mock
const fetchMock = vi.fn();

// Set global fetch to our mock
global.fetch = fetchMock.mockImplementation(async (url: string | URL) => {
  const urlString = url.toString();

  // Parse URL to determine which endpoint was called
  let mockResponse;

  if (urlString.includes('/carriers/')) {
    // Single carrier
    const carrierId = urlString.match(/\/carriers\/(\d+)/)?.[1];
    const endpoint = new GetCarrier(Number(carrierId));
    mockResponse = await mockGetCarrier(endpoint, {});
  } else if (urlString.includes('/carriers')) {
    // All carriers
    const endpoint = new GetCarriers();
    mockResponse = await mockGetCarriers(endpoint, {});
  } else if (urlString.includes('/delivery_options')) {
    // Delivery options
    const endpoint = new GetDeliveryOptions();
    // Parse query params from URL and put them in parameters structure
    const queryParams = new URL(urlString).searchParams;
    const parameters = Object.fromEntries(queryParams.entries());
    mockResponse = await mockGetDeliveryOptions(endpoint, {parameters});
  } else if (urlString.includes('/pickup_locations')) {
    // Pickup locations
    const endpoint = new GetPickupLocations();
    const queryParams = new URL(urlString).searchParams;
    const parameters = Object.fromEntries(queryParams.entries());
    mockResponse = await mockGetPickupLocations(endpoint, {parameters});
  } else {
    // Unknown endpoint - return empty response
    mockResponse = {data: {}};
  }

  // Return a proper Response object
  return new Response(JSON.stringify(mockResponse), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  });
});

// Export for cleanup
export const resetFetchMock = (): void => {
  fetchMock.mockClear();
  global.fetch = originalFetch;
};
