import * as CONFIG from '@/data/keys/configKeys';
import { isPastCutoffTime } from '@/helpers/delivery/isPastCutoffTime';
import { isPastSameDayCutoffTime } from '@/helpers/delivery/isPastSameDayCutoffTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {MyParcel.CarrierName} carrier
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function hasSameDayDelivery(carrier = null, configBus = realConfigBus) {
  carrier = carrier ?? configBus.currentCarrier;

  const hasSameDay = configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY, null, carrier);

  if (!hasSameDay) {
    return false;
  }

  return isPastCutoffTime(null, configBus) || !isPastSameDayCutoffTime(null, configBus);
}
