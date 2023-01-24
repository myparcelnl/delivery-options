import {CONFIG} from '../../data';
import { isPastTime } from '../../config/isPastTime';
import { configBus as realConfigBus } from '../../config/configBus';

/**
 * @param {MyParcel.CarrierName} carrierName
 * @param {import('../../config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {boolean}
 */
export function isPastCutoffTime(carrierName = null, configBus = realConfigBus) {
  return isPastTime(configBus.get(CONFIG.CUTOFF_TIME, carrierName));
}
