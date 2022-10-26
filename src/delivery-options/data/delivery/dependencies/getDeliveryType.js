import { DELIVERY_SAME_DAY } from '@/config/formConfig';
import { possibilityIsSameDay } from '@/delivery-options/data/delivery/dependencies/possibilityIsSameDay';

/** .........
 * This function checks if the sameDay option is allowed as delivery type and changes it accordingly
 *
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} possibility
 *
 * @returns {MyParcelDeliveryOptions.DeliveryType}
 */
export function getDeliveryType(possibility) {
  let { type } = possibility;

  if (possibilityIsSameDay(possibility)) {
    type = DELIVERY_SAME_DAY;
  }

  return type;
}
