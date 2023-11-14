import {fetchFromEndpoint} from '../request/fetchFromEndpoint';
import {endpointCarriers} from '../endpoints';
import {formatCarrierResponse} from './formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {MyParcel.CarrierNameOrId} carrier
 *
 * @returns {Promise<MyParcelDeliveryOptions.CarrierData[]>}
 */
export async function fetchCarrierData(carrier = null) {
  const data = await fetchFromEndpoint(endpointCarriers, {path: carrier});

  return formatCarrierResponse(data);
}
