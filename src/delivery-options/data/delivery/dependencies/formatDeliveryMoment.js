import { SHIPMENT_OPTIONS, deliveryMoments } from '@/config/formConfig';
import { formatPossibility } from '@/delivery-options/data/delivery/dependencies/formatPossibility';
import { formatShipmentOptions } from '@/delivery-options/data/delivery/dependencies/formatShipmentOptions';
import { getDeliveryType } from '@/delivery-options/data/delivery/dependencies/getDeliveryType';

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
      return {
        ...acc,
        [getDeliveryType(possibility)]: {
          moments: formatPossibility(possibility),
          [SHIPMENT_OPTIONS]: formatShipmentOptions(possibility),
        },
      };
    }, {});
}
