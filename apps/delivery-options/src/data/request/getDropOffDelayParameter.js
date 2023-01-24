import * as CONFIG from '@/data/keys/configKeys';
import * as CARRIERS from '@/data/keys/carrierKeys';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {MyParcel.CarrierName} carrier
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Partial<DeliveryOptionsRequestParameters>}
 */
export function getDropOffDelayParameter(carrier, configBus = realConfigBus) {
  let dropOffDelay = configBus.get(CONFIG.DROP_OFF_DELAY, null, carrier);

  // Don't allow Instabox drop-off delay to be 0 to prevent showing same day delivery when it's not possible.
  if (!configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY, null, carrier)
    && dropOffDelay === 0) {
    dropOffDelay = 1;
  }

  if (hasSameDayDelivery(carrier, configBus)) {
    dropOffDelay = isPastCutoffTime(carrier, configBus) ? 1 : 0;
  }

  return dropOffDelay;
}
