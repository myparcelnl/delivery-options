import { LOCALE } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { createDate } from '@/delivery-options/data/dates/createDate';

/**
 * Format a given date string into the locale format set through the configBus. Force the timezone to be UTC to avoid
 *  issues.
 *
 * @param {String} date - Date string to format.
 * @param {Object} options - Options for formatting. Defaults to "HH:mm" format.
 *
 * @returns {String}
 */
export function createLocaleString(date,
  options = {
    hour: '2-digit',
    minute: '2-digit',
  }) {
  return createDate(date)
    .toLocaleString(
      configBus.get(LOCALE),
      {
        ...options,
        timeZone: 'UTC',
      },
    );
}
