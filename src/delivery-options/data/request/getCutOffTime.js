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
 * @returns {{cutoff_time}|{dropoff_delay: number, cutoff_time}}
 */
export function getCutOffTime(configBus = realConfigBus) {
  const extraDropOffDay = getExtraDropOffDay(configBus);
  const todayIsExtraDropOffDay = extraDropOffDay && checkIsDropOffDay(extraDropOffDay.dropOffDay, configBus);

  if (todayIsExtraDropOffDay) {
    return configBus.get(extraDropOffDay.cutoffTime);
  }

  const cutOffTime = configBus.get(CONFIG.CUTOFF_TIME);

  if (configBus.isEnabled(CONFIG.ALLOW_SAME_DAY_DELIVERY)) {
    const sameDayCutOffTime = configBus.get(CONFIG.CUTOFF_TIME_SAME_DAY);
    const isBeforeTime = (time) => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const parsedTime = time.split(':');
      const sameDayHours = parseInt(parsedTime[0]);

      if (hours <= sameDayHours) {
        return true;
      }

      return sameDayHours === hours && minutes <= parseInt(parsedTime[1]);
    };

    if (!isBeforeTime(sameDayCutOffTime)) {
      return {
        cutoff_time: cutOffTime,
        dropoff_delay: 1,
      };
    }

    return {
      cutoff_time: sameDayCutOffTime,
    };
  }

  const dropOffDelay = configBus.get(CONFIG.DROP_OFF_DELAY);

  return {
    cutoff_time: configBus.get(CONFIG.CUTOFF_TIME),
    dropoff_delay: dropOffDelay === 0 ? 1 : dropOffDelay,
  };
}
