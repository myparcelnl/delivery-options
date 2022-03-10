import * as CONFIG from '@/data/keys/configKeys';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {Partial<DeliveryOptionsRequestParameters>}
 */
export function getDropOffDelayParameter(configBus = realConfigBus) {
  if (!configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY) && !isPastCutoffTime()) {
    const dropOffdelay = configBus.get(CONFIG.DROP_OFF_DELAY);
    return {
      dropoff_delay: dropOffdelay === 0 ? 1 : dropOffdelay,
    };
  }

  let dropOffdelay = 1;

  if (hasSameDayDelivery()) {
    dropOffdelay = isPastCutoffTime(configBus) ? 1 : 0;
  }

  return {
    dropoff_delay: dropOffdelay,
  };
}
