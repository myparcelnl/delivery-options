import * as CONFIG from '@/data/keys/configKeys';
import { SHIPMENT_OPTIONS, deliveryMoments } from '@/config/formConfig';
import { formatPossibility } from '@/delivery-options/data/delivery/dependencies/formatPossibility';
import { formatShipmentOptions } from '@/delivery-options/data/delivery/dependencies/formatShipmentOptions';
import { getDeliveryType } from '@/delivery-options/data/delivery/dependencies/getDeliveryType';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * Delivery moment is dependant on delivery date.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption} option
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencyMoments}
 */
export function formatDeliveryMoment(option) {
  return option.possibilities
    .sort((possibilityA, possibilityB) => {
      return deliveryMoments.indexOf(possibilityA.type) - deliveryMoments.indexOf(possibilityB.type);
    })
    .reduce((acc, possibility) => {
      if (!configBus.get(CONFIG.FEATURE_SHOW_DELIVERY_DATE) && ['morning', 'evening'].includes(possibility.type)) {
        return { ...acc };
      }
      return {
        ...acc,
        [getDeliveryType(possibility)]: {
          moments: formatPossibility(possibility),
          [SHIPMENT_OPTIONS]: formatShipmentOptions(possibility),
        },
      };
    }, {});
}
