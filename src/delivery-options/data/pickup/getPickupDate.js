import * as FORM from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';
import { createIsoString } from '@/delivery-options/data/dates/createIsoString';

/**
 * Get the pickup date from given possibilities array using the currently selected pickup moment.
 *
 * @param {Object[]} possibilities - Possibilities array from pickup_locations response.
 *
 * @returns {string}
 */
export function getPickupDate(possibilities) {
  // Get the possibility that belongs to the currently selected pickup moment
  const possibility = possibilities.find((item) => {
    return item.delivery_type_name === configBus.getValue(FORM.PICKUP_MOMENT);
  });

  return possibility.moment?.start?.date ? createIsoString(possibility.moment.start.date) : null;
}
