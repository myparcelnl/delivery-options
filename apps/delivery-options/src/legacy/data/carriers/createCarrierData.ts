/**
 * @param {{name: string, human: string, id: number}[]} apiCarriers
 * @param {{name: MyParcel.CarrierName, identifier: MyParcel.CarrierIdentifier}[]} configCarriers
 *
 * @returns {Array}
 */
export function createCarrierData(apiCarriers, configCarriers) {
  return configCarriers.map((configCarrier) => {
    const match = apiCarriers.find((apiCarrier) => apiCarrier.name === configCarrier.name);

    return {
      ...match,
      ...configCarrier,
      pickupEnabled: configBus.isEnabled(formConfigPickup, null, configCarrier.identifier),
      deliveryEnabled: configBus.isEnabled(formConfigDelivery, null, configCarrier.identifier),
    };
  });
}
