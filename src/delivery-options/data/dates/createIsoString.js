import { createDate } from '@/delivery-options/data/dates/createDate';

/**
 * Return the date as ISO string to get a date string without changing the date/time because of timezones.
 * Example: "2019-11-15T17:00:00.000Z".
 *
 * @param {string} date - Date string.
 *
 * @returns {string}
 */
export function createIsoString(date) {
  return createDate(date).toISOString();
}
