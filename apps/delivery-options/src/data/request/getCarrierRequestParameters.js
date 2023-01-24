import {CARRIERS} from '../../data';
import { getInstaboxDropOffDelay } from '../../data/request/getInstaboxDropOffDelay';

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
