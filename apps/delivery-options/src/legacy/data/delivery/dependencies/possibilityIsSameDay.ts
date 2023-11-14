import {SAME_DAY_DELIVERY} from '@myparcel-do/shared';

/**
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} possibility
 *
 * @returns {boolean}
 */
export function possibilityIsSameDay(possibility) {
  return possibility.shipment_options.some((shipmentOption) => {
    return (
      SAME_DAY_DELIVERY === shipmentOption.name &&
      shipmentOption.schema.enum.length === 1 &&
      shipmentOption.schema.enum[0]
    );
  });
}
