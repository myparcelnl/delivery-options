import * as FORM from '@/config/formConfig';
import { DELIVERY_SAME_DAY, DELIVERY_STANDARD } from '@/config/formConfig';
import { shouldShowDeliveryDate } from '@/delivery-options/config/exports/DeliveryExportValues';

export class ExportValues {
  /**
   * @type {MyParcel.CarrierName}
   */
  carrier;

  /**
   * @type {MyParcelDeliveryOptions.DeliveryType}
   */
  deliveryType;

  /**
   * Method to check if the values are complete and should be communicated with the external platform.
   *
   * @returns {boolean}
   */
  isComplete() {
    return !!this.deliveryType;
  }

  /**
   * @param {MyParcel.CarrierName} carrier
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

    this.deliveryType = deliveryType;
  }

  setDeliveryDate(values) {
    this.deliveryDate = shouldShowDeliveryDate(values);
  }

  setShipmentOptions(values) {
    const shipmentOptions = values[FORM.SHIPMENT_OPTIONS] || this.shipmentOptions;

    if (values[FORM.DELIVERY_MOMENT] === DELIVERY_SAME_DAY) {
      shipmentOptions.same_day_delivery = true;
    }

    this.shipmentOptions = shipmentOptions;
  }
}
