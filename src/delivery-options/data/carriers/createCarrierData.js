import { formConfigDelivery, formConfigPickup } from '@/config/formConfig';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * @param {{name: string, human: string, id: number}[]} data
 * @param {{name: MyParcel.CarrierName, identifier: MyParcel.CarrierIdentifier}[]} carriers
 *
 * @returns {Array}
 */
export function createCarrierData(data, carriers) {
  return data.map((carrier) => {
    const match = carriers.find((item) => item.name === carrier.name);

    return {
      ...carrier,
      identifier: match?.identifier,
      pickupEnabled: configBus.isEnabled(formConfigPickup, null, carrier.name),
      deliveryEnabled: configBus.isEnabled(formConfigDelivery, null, carrier.name),
    };
  });
}
