import { createLocaleString } from '../../dates';

/**
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} deliveryPossibility
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencies['moment']}
 */
export function formatPossibility(deliveryPossibility) {
  return deliveryPossibility.delivery_time_frames.reduce((acc, timeFrame) => ({
    ...acc,
    [timeFrame.type]: createLocaleString(timeFrame.date_time.date),
  }), {});
}
