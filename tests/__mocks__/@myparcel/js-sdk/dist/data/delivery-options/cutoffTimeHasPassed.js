import { createCutOffTimeDate } from '@Tests/helpers/createCutOffTimeDate';

/**
 * @param {String} cutoffTime - Timestamp in HH:mm format.
 * @param {import('dayjs').Dayjs} date
 *
 * @returns {import('dayjs').Dayjs}
 */
export function cutoffTimeHasPassed(cutoffTime, date) {
  const cutOffTimeDate = createCutOffTimeDate(cutoffTime, date);

  return !date.isBefore(cutOffTimeDate);
}
