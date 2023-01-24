import {CONFIG} from '../../data';
import { isPastTime } from '../../config/isPastTime';
import { configBus as realConfigBus } from '../../config/configBus';

/**
 * @param {MyParcel.CarrierName} carrierName
 * @param {import('../../config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function isPastSameDayCutoffTime(carrierName = null, configBus = realConfigBus) {
  return isPastTime(configBus.get(CONFIG.CUTOFF_TIME_SAME_DAY, carrierName));
}
