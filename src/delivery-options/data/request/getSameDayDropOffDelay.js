import * as CONFIG from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';

/**
 * DropOff delay when same-day delivery is disabled should never be 0 and when enabled, dropOff delay will vary between
 * 1 or 0, determined by whether the cutoff time has passed.
 *
 * @param {MyParcel.CarrierName} carrier
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export function getSameDayDropOffDelay(carrier) {
  let dropOffDelay = configBus.get(CONFIG.DROP_OFF_DELAY, null, carrier);

  // Don't allow drop-off delay to be 0 to prevent showing same-day delivery when it's not possible.
  if (dropOffDelay === 0) {
    dropOffDelay = 1;
  }

  if (hasSameDayDelivery(carrier, configBus)) {
    dropOffDelay = isPastCutoffTime(carrier, configBus) ? 1 : 0;
  }

  return {
    dropoff_delay: dropOffDelay,
  };
}
