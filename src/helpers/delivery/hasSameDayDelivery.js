import * as CONFIG from '@/data/keys/configKeys';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';
import { isPastSameDayCutoffTime } from '@/helpers/delivery/isPastSameDayCutoffTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function hasSameDayDelivery(configBus = realConfigBus) {
  const hasSameDay = configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY);

  if (!hasSameDay) {
    return false;
  }

  return isPastCutoffTime(null, configBus) || !isPastSameDayCutoffTime(null, configBus);
}
