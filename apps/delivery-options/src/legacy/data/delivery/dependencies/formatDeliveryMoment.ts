import {getDeliveryType} from './getDeliveryType';
import {formatShipmentOptions} from './formatShipmentOptions';
import {formatPossibility} from './formatPossibility';

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
      if (
        !configBus.get(CONFIG.FEATURE_SHOW_DELIVERY_DATE) &&
        [DELIVERY_MORNING, DELIVERY_EVENING].includes(possibility.type)
      ) {
        return {...acc};
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
