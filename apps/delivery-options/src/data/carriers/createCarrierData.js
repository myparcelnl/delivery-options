import { formConfigDelivery, formConfigPickup } from '../../config/formConfig';
import { configBus } from '../../config/configBus';

/**
 * Create the array of carrier data, deduping and adding pickup/delivery settings.
 *
 * @param {Array} data - Data.
 *
 * @returns {Array}
 */
export function createCarrierData(data) {
  return data.map((carrier) => {
    return {
      ...carrier,
      pickupEnabled: configBus.isEnabled(formConfigPickup, null, carrier.name),
      deliveryEnabled: configBus.isEnabled(formConfigDelivery, null, carrier.name),
    };
  });
}
