import * as CONFIG from '@/data/keys/configKeys';
import { extraDeliveryConfig } from '@/config/extraDeliveryConfig';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Get cutoff time for a special delivery day. Returns default cutoff time if the conditions for an extra delivery day
 *  don't pass.
 *
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {MyParcelDeliveryOptions.Config.cutoffTime}
 */
export function getCutOffTime(configBus = realConfigBus) {
  const today = new Date().getDay();

  const extraDropOffDay = extraDeliveryConfig.find((setting) => {
    const allowedForPlatform = setting.platforms.includes(configBus.get(CONFIG.PLATFORM));
    const todayIsExtraDay = today === setting.dropOffDay;
    const requirementsFulfilled = setting.requires.every((requirement) => Boolean(configBus.get(requirement)));
    const extraDayIsDropOffDay = configBus.get(CONFIG.DROP_OFF_DAYS).includes(setting.dropOffDay);

    return todayIsExtraDay && allowedForPlatform && extraDayIsDropOffDay && requirementsFulfilled;
  });

  return extraDropOffDay
    ? configBus.get(extraDropOffDay.cutoffTime)
    : configBus.get(CONFIG.CUTOFF_TIME);
}
