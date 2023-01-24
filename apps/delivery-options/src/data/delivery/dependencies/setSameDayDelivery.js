import { SAME_DAY_DELIVERY } from '../../../config';

/**
 * The first element of the delivery options will be the only candidate for sameday delivery, in case
 * sameday delivery is available, this function will turn the sameday shipment option into true.
 *
 * @param {MyParcelDeliveryOptions.DeliveryOption} option
 */
export function setSameDayDelivery(option) {
  const shipmentOptions = option.possibilities[0].shipment_options
    .find((shipmentOption) => shipmentOption.name === SAME_DAY_DELIVERY);

  if (!shipmentOptions) {
    return;
  }

  shipmentOptions.schema.enum = [true];
}
