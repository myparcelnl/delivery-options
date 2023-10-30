import { CARRIER_SETTINGS } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { createCarrierData } from '@/delivery-options/data/carriers/createCarrierData';
import { fetchCarrierData } from '@/delivery-options/data/carriers/fetchCarrierData';
import { fetchMultiple } from '@/delivery-options/data/request/fetchMultiple';
import { resolveCarrierName } from './resolveCarrierName';

/**
 * Fetch all carrier information, based on the carriers in config.carrierSettings.
 *
 * @returns {Promise.<configBus>}
 */
export async function fetchAllCarriers() {
  const carriersToFetch = Object.keys(configBus.get(CARRIER_SETTINGS)).map((identifier) => ({
    identifier,
    name: resolveCarrierName(identifier),
  }));

  // Create an array with a request for each carrier.
  const requests = carriersToFetch.map((carrier) => () => fetchCarrierData(carrier.name));

  // Get the responses and errors from all the requests.
  const { responses } = await fetchMultiple(requests);

  // Create the carrierData array
  configBus.carrierData = createCarrierData(responses, carriersToFetch);

  // Set the first carrier to currentCarrier
  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].identifier : null;

  return configBus;
}
