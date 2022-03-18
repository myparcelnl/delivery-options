import * as CONFIG from '@/data/keys/configKeys';
import { isPastTime } from '@/delivery-options/config/isPastTime';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {MyParcel.CarrierName} carrierName
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function isPastCutoffTime(carrierName = null, configBus = realConfigBus) {
  return isPastTime(configBus.get(CONFIG.CUTOFF_TIME, carrierName));
}
