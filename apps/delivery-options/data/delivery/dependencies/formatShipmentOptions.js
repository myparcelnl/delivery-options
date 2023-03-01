/**
 * Shipment options depends on delivery moment.
 *
 * @param {MyParcelDeliveryOptions.DeliveryPossibility} possibility
 *
 * @returns {MyParcelDeliveryOptions.DeliveryDependencyMoment['shipment_options']}
 */
export function formatShipmentOptions(possibility) {
  return possibility.shipment_options
    .reduce((shipmentOptions, shipmentOption) => ({
      ...shipmentOptions,
      [shipmentOption.name]: shipmentOption.schema,
    }), {});
}
