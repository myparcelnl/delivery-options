import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * @param {Number} dropOffDay
 * @param {import('@/delivery-options/config/configBus').configBus} configBus
 * @param {Number} day
 *
 * @returns {Boolean}
 */
export function checkIsDropOffDay(dropOffDay, configBus = realConfigBus, day = new Date().getDay()) {
  const dateMatches = day === dropOffDay;
  const dateIsDropOffDay = configBus.get(CONFIG.DROP_OFF_DAYS).includes(day);

  return dateMatches && dateIsDropOffDay;
}
