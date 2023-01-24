import * as CONFIG from '@/data/keys/configKeys';
import { END_OF_DAY_CUTOFF_TIME } from '@/data/keys/settingsConsts';
import { checkIsDropOffDay } from '@/helpers/delivery/checkIsDropOffDay';
import { getExtraDropOffDay } from '@/delivery-options/data/request/getExtraDropOffDay';
import { hasSameDayDelivery } from '@/helpers/delivery/hasSameDayDelivery';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';
import { isPastCutoffTime } from './isPastCutoffTime';

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
export function getCutoffTime(configBus = realConfigBus) {
  const extraDropOffDay = getExtraDropOffDay(configBus);
  const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);

  let cutoffTime = configBus.get(CONFIG.CUTOFF_TIME);

  if (todayIsExtraDropOffDay) {
    return configBus.get(extraDropOffDay.cutoffTime);
  }

  if (hasSameDayDelivery()) {
    cutoffTime = isPastCutoffTime(configBus) ? END_OF_DAY_CUTOFF_TIME : configBus.get(CONFIG.CUTOFF_TIME_SAME_DAY);
  }

  return cutoffTime;
}
