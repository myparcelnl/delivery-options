import {CONFIG} from '../../data';
import { configBus as realConfigBus } from '../../config/configBus';

/**
 * Get the default parameters for all API requests.
 *
 * @param {import('../../config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export const getDefaultRequestParameters = (configBus = realConfigBus) => {
  const parameters = {
    /**
     * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
     *
     * @see https://jsonapi.org/format/#fetching-includes
     */
    include: 'shipment_options',

    platform: configBus.get(CONFIG.PLATFORM),
    carrier: configBus.currentCarrier,
  };

  const addressValues = {
    cc: configBus.address.cc,
    city: configBus.address.city,
    postal_code: configBus.address.postalCode,
    // If number is present, don't use the street field.
    ...configBus.address.number
      ? { number: configBus.address.number }
      : { street: configBus.address.street },
  };

  Object.keys(addressValues).forEach((key) => {
    /**
     * Skip undefined items.
     */
    if (!addressValues[key]) {
      return;
    }

    parameters[key] = addressValues[key];
  });

  return parameters;
};
