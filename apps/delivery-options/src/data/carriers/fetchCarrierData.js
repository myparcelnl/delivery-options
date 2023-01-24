import { METHOD_SEARCH, fetchFromEndpoint } from '../../data/request/fetchFromEndpoint';
import { formatCarrierResponse } from '../../data/carriers/formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {MyParcel.CarrierNameOrId} carrier
 *
 * @returns {Promise<MyParcelDeliveryOptions.CarrierData[]>}
 */
export async function fetchCarrierData(carrier = null) {
  const params = {};

  if (carrier) {
    params.carrier = carrier;
  }

  const data = await fetchFromEndpoint(
    'carriers',
    {
      method: METHOD_SEARCH,
      params,
    },
  );

  return formatCarrierResponse(data);
}
