import * as CONFIG from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 *
 * @param {Date} date
 * @param {string} locale - Optional locale override.
 *
 * @returns {string}
 */
export const getDay = (date, locale = configBus.get(CONFIG.LOCALE)) => {
  return date.toLocaleString(
    locale,
    { weekday: 'long' },
  );
};
