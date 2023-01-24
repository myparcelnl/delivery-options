import * as CARRIERS from '@/data/keys/carrierKeys';
import { getInstaboxDropOffDelay } from '@/delivery-options/data/request/getInstaboxDropOffDelay';

/**
 * @param {MyParcel.CarrierName} carrier
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export function getCarrierRequestParameters(carrier) {
  return {
    ...carrier === CARRIERS.INSTABOX ? getInstaboxDropOffDelay() : {},
  };
}
