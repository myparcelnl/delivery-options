import {CARRIERS} from '../../data';
import {CONFIG} from '../../data';
import { configBus } from '../../config/configBus';
import { hasSameDayDelivery } from '../../helpers/delivery/hasSameDayDelivery';
import { isPastCutoffTime } from '../../helpers/delivery/isPastCutoffTime';

/**
 * DropOff delay for Instabox when sameday delivery is disabled should never be 0 and when enabled, dropOff delay will
 * vary between 1 or 0, determined by whether the cutoff time has passed.
 *
 * @returns {Partial<MyParcelDeliveryOptions.DeliveryOptionsRequestParameters>}
 */
export function getInstaboxDropOffDelay() {
  let dropOffDelay = configBus.get(CONFIG.DROP_OFF_DELAY, null, CARRIERS.INSTABOX);

  // Don't allow Instabox drop-off delay to be 0 to prevent showing same day delivery when it's not possible.
  if (dropOffDelay === 0) {
    dropOffDelay = 1;
  }

  if (hasSameDayDelivery(CARRIERS.INSTABOX, configBus)) {
    dropOffDelay = isPastCutoffTime(CARRIERS.INSTABOX, configBus) ? 1 : 0;
  }

  return {
    dropoff_delay: dropOffDelay,
  };
}
