import { DELIVERY_SAME_DAY } from '@/config/formConfig';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { possibilityIsSameDay } from '@/delivery-options/data/delivery/dependencies/possibilityIsSameDay';

/**
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} possibility
 *
 * @returns {MyParcelDeliveryOptions.DeliveryType}
 */
export function getDeliveryType(possibility) {
  let { type } = possibility;

  if (possibilityIsSameDay(possibility) || hasSameDayDelivery()) {
    type = DELIVERY_SAME_DAY;
  }

  return type;
}
