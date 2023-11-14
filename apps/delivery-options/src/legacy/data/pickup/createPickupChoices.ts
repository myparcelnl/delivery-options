import {getCarrierConfiguration} from '@myparcel-do/shared';
import {fetchPickupLocations} from './fetchPickupLocations';
import {fetchMultiple} from '../request';
import {sortPickupLocations} from './sortPickupLocations';
import {formatPickupLocations} from './formatPickupLocations';
import {getPickupMoments} from './getPickupMoments';

/**
 * Format the pickup locations into choices for use with the recursive form.
 *
 * @param {Function} createRequestCallback - The callback used to create the array of requests. You can modify
 *  parameters here.
 *
 * @returns {Object[]}
 */
export async function createPickupChoices(createRequestCallback = null) {
  const defaultCallback = (carrier) => {
    const carrierConfiguration = getCarrierConfiguration(
      carrier.name,
      configBus.get('platform'),
    );

    return fetchPickupLocations(carrierConfiguration);
  };

  const requests = configBus.carrierDataWithPickupLocations.map(createRequestCallback || defaultCallback);

  let { responses } = await fetchMultiple(requests);

  if (!responses.length) {
    return [];
  }

  responses = sortPickupLocations(responses);

  // Create/update the pickupLocations object on configBus for later reference when sending data to the application.
  configBus.pickupLocations = formatPickupLocations(responses);

  return responses.map((option) => ({
    pickupData: option,
    name: option.location.location_code,
    label: option.location.location_name,
    carrier: option.carrier,
    image: option.carrier.image,
    options: getPickupMoments(option),
  }));
}
