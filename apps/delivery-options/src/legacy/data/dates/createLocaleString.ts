import {createDate} from './createDate';

/**
 * Format a given date string into the locale format set through the configBus. Force the timezone to be UTC to avoid
 *  issues.
 *
 * @param {string} date - Date string to format.
 * @param {Object} options - Options for formatting. Defaults to "HH:mm" format.
 *
 * @returns {string}
 */
export function createLocaleString(
  date,
  options = {
    hour: '2-digit',
    minute: '2-digit',
  },
) {
  return createDate(date).toLocaleString(configBus.get(LOCALE), {
    ...options,
    timeZone: 'UTC',
  });
}
