import * as CONFIG from '@/data/keys/configKeys';
import { checkIsDropOffDay } from '@/delivery-options/data/request/checkIsDropOffDay';
import { getExtraDropOffDay } from '@/delivery-options/data/request/getExtraDropOffDay';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Get the correct cutoff time for today as follows:
 * - Extra drop off day cutoff time, if monday or saturday delivery is enabled and today is the respective dropoff day.
 * - Same day cutoff time, if enabled
 * - Default cutoff time.
 *
 * @param {import('@/delivery-options/config/configBus').configBus} configBus - Optional parameter for easier testing.
 *
 * @returns {string}
 */
export function getCutOffTime(configBus = realConfigBus) {
  const extraDropOffDay = getExtraDropOffDay(configBus);
  const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);

  if (todayIsExtraDropOffDay) {
    return configBus.get(extraDropOffDay.cutoffTime);
  }

  return configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY)
    ? configBus.get(CONFIG.CUTOFF_TIME_SAME_DAY)
    : configBus.get(CONFIG.CUTOFF_TIME);
}
