import { formConfigDelivery, formConfigPickup } from '@/config/formConfig';
import {
  getAllowedCountriesForCarrierDeliver,
  getAllowedCountriesForCarrierPickup,
} from '@/config/countryConfig';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * Create the array of carrier data, deduping and adding pickup/delivery settings.
 *
 * @param {Array} data - Data.
 *
 * @returns {Array}
 */
export function createCarrierData(data) {
  return data.map((carrier) => ({
    ...carrier,
    pickupEnabled: configBus.isEnabled(formConfigPickup, null, carrier.name),
    deliveryEnabled: configBus.isEnabled(formConfigDelivery, null, carrier.name),
    pickupCountries: getAllowedCountriesForCarrierPickup(carrier.name),
    deliverCountries: getAllowedCountriesForCarrierDeliver(carrier.name),
  }));
}
