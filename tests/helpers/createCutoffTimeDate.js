import dayjs from 'dayjs';

/**
 * @param {String} cutoffTime - String in HH:mm format.
 * @param {import('dayjs').Dayjs} date
 *
 * @returns {import('dayjs').Dayjs}
 */
export function createCutOffTimeDate(cutoffTime, date = dayjs()) {
  const [hour, minute] = cutoffTime.split(':');

  return date.set('h', parseInt(hour)).set('m', parseInt(minute));
}
