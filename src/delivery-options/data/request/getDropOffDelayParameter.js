import * as CONFIG from '@/data/keys/configKeys';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 *
 * @returns {Partial<DeliveryOptionsRequestParameters>}
 * @param {string} carrier
 * @param configBus
 */
export function getDropOffDelayParameter(carrier, configBus = realConfigBus) {
  if (!configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY)) {
    return carrier === 'instabox'
      ? {
        dropoff_delay: 1,
      }
      : {};
  }

  let dropOffdelay = 1;

  if (hasSameDayDelivery()) {
    dropOffdelay = isPastCutoffTime(configBus) ? 1 : 0;
  }

  return {
    dropoff_delay: dropOffdelay,
  };
}
