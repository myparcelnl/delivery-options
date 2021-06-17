import * as CONFIG from '@/data/keys/configKeys';
import { checkIsDropOffDay } from '@/delivery-options/data/request/checkIsDropOffDay';
import { getExtraDropOffDay } from '@/delivery-options/data/request/getExtraDropOffDay';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Get cutoff time for a special delivery day. Returns default cutoff time if the conditions for an extra delivery day
 *  don't pass.
 *
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {String}
 */
export function getCutOffTime(configBus = realConfigBus) {
  const extraDropOffDay = getExtraDropOffDay(configBus);
  const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);

  return todayIsExtraDropOffDay
    ? configBus.get(extraDropOffDay.cutoffTime)
    : configBus.get(CONFIG.CUTOFF_TIME);
}
