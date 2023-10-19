import { AbstractCarrierConfiguration } from '@/data/carriers/abstractCarrierConfiguration';
import { endpointPickupLocations } from '../endpoints';
import { fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { getRequestParameters } from '@/delivery-options/data/request/getRequestParameters';

/**
 * Fetch pickup options.
 *
 * @param {AbstractCarrierConfiguration} carrierConfiguration
 * @param {Object} parameters - Request parameters which will be appended after getRequestParameters().
 * @returns {Promise}
 */
export async function fetchPickupLocations(carrierConfiguration, parameters = {}) {
  const data = await fetchFromEndpoint(
    endpointPickupLocations,
    {
      params: {
        ...getRequestParameters(carrierConfiguration),
        ...parameters,
      },
    },
  );

  /**
   * Add the carrier to the response.
   */
  return data.map((pickupLocation) => ({
    ...pickupLocation,
    carrier: carrierConfiguration?.getName(),
  }));
}
