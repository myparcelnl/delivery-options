import { endpointCarriers } from '../endpoints';
import { fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { formatCarrierResponse } from '@/delivery-options/data/carriers/formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {MyParcel.CarrierNameOrId} carrier
 *
 * @returns {Promise<MyParcelDeliveryOptions.CarrierData[]>}
 */
export async function fetchCarrierData(carrier = null) {
  const data = await fetchFromEndpoint(endpointCarriers, { path: carrier });

  return formatCarrierResponse(data);
}
