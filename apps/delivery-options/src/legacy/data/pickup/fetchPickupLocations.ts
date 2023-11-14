import {fetchFromEndpoint, getRequestParameters} from '../request';
import {endpointPickupLocations} from '../endpoints';

/**
 * Fetch pickup options.
 *
 * @param {AbstractCarrierConfiguration} carrierConfiguration
 * @param {Object} parameters - Request parameters which will be appended after getRequestParameters().
 * @returns {Promise}
 */
export async function fetchPickupLocations(carrierConfiguration, parameters = {}) {
  const data = await fetchFromEndpoint(endpointPickupLocations, {
    params: {
      ...getRequestParameters(carrierConfiguration),
      ...parameters,
    },
  });

  /**
   * Add the carrier to the response.
   */
  return data.map((pickupLocation) => ({
    ...pickupLocation,
    carrier: carrierConfiguration?.getName(),
  }));
}
