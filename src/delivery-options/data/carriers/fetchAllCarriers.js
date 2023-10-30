import { CARRIER_SETTINGS } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { createCarrierData } from '@/delivery-options/data/carriers/createCarrierData';
import { fetchCarrierData } from '@/delivery-options/data/carriers/fetchCarrierData';
import { fetchMultiple } from '@/delivery-options/data/request/fetchMultiple';
import { resolveCarrierName } from './resolveCarrierName';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { carrierCanOnlyHaveSameDayDelivery } from '@/helpers/delivery/carrierCanOnlyHaveSameDayDelivery';
import { isPastSameDayCutoffTime } from '@/helpers/delivery/isPastSameDayCutoffTime';
import * as CONFIG from '@/data/keys/configKeys';

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

  configBus.carrierDataWithPickupLocations = configBus.carrierData.filter((carrier) => {
    const carrierConfiguration = CarrierConfigurationFactory.create(carrier.identifier);

    return carrier.pickupEnabled && carrierConfiguration.allowsPickupIn(configBus.address.cc);
  });

  configBus.carrierDataWithDeliveryOptions = configBus.carrierData.filter((carrier) => {
    const carrierConfiguration = CarrierConfigurationFactory.create(carrier.identifier);

    if (carrierCanOnlyHaveSameDayDelivery(carrier.identifier) && isPastSameDayCutoffTime(carrier.identifier)) {
      // We don't have a carrier with only same-day delivery at the moment, so this won't be covered.
      /* istanbul ignore next */
      return false;
    }

    return carrier.deliveryEnabled
            && carrierConfiguration.allowsDeliveryIn(configBus.address.cc)
            && carrierConfiguration.allowsPackageTypeIn(configBus.get(CONFIG.PACKAGE_TYPE), configBus.address.cc);
  });

  return configBus;
}
