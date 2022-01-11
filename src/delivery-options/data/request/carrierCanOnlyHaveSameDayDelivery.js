import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {MyParcel.CarrierName} carrierName
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function carrierCanOnlyHaveSameDayDelivery(carrierName, configBus = realConfigBus) {
  const hasSameDayDelivery = configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY, null, carrierName);
  const hasWindowOfOneDay = configBus.get(CONFIG.DELIVERY_DAYS_WINDOW, carrierName) === 1;
  const hasNoDropOffDelay = configBus.get(CONFIG.DROP_OFF_DELAY, carrierName) === 0;

  return hasSameDayDelivery && hasWindowOfOneDay && hasNoDropOffDelay;
}
