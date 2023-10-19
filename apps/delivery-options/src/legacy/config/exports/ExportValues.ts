import * as FORM from '@/config/formConfig';
import { DELIVERY_SAME_DAY, DELIVERY_STANDARD } from '@/config/formConfig';

export class ExportValues {
  /**
   * @type {MyParcel.CarrierIdentifier}
   */
  carrier;

  /**
   * @type {null|MyParcelDeliveryOptions.DeliveryType}
   */
  deliveryType;

  /**
   * @param {MyParcel.CarrierIdentifier} carrier
   */
  setCarrier(carrier) {
    this.carrier = carrier || this.carrier;
  }

  /**
   * @param {MyParcelDeliveryOptions.DeliveryType} deliveryType
   */
  setDeliveryType(deliveryType) {
    // Transform internal sameDay delivery type back to standard.
    if (deliveryType === DELIVERY_SAME_DAY) {
      deliveryType = DELIVERY_STANDARD;
    }

    this.deliveryType = deliveryType ?? DELIVERY_STANDARD;
  }

  setShipmentOptions(values) {
    const shipmentOptions = values[FORM.SHIPMENT_OPTIONS] || this.shipmentOptions;
    shipmentOptions.same_day_delivery = values[FORM.DELIVERY_MOMENT] === DELIVERY_SAME_DAY;

    this.shipmentOptions = shipmentOptions;
  }
}
