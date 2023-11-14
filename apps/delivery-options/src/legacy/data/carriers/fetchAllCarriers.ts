import {fetchMultiple} from '../request/fetchMultiple';
import {resolveCarrierName} from './resolveCarrierName';
import {fetchCarrierData} from './fetchCarrierData';
import {createCarrierData} from './createCarrierData';

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
  const {responses} = await fetchMultiple(requests);

  // Create the carrierData array
  configBus.carrierData = createCarrierData(responses, carriersToFetch);

  // Set the first carrier to currentCarrier
  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].identifier : null;

  return configBus;
}
