import * as CONFIG from '../data/keys/configKeys';
import {configBus as realConfigBus} from '../delivery-options/config/configBus';

/**
 * @param {number} dropOffDay
 * @param {import('../delivery-options/config/configBus').configBus} configBus
 * @param {number} day
 *
 * @returns {boolean}
 */
export function checkIsDropOffDay(dropOffDay: number, configBus = realConfigBus, day = new Date().getDay()) {
  const dateMatches = day === dropOffDay;
  const dateIsDropOffDay = configBus.get(CONFIG.DROP_OFF_DAYS).includes(day);

  return dateMatches && dateIsDropOffDay;
}
