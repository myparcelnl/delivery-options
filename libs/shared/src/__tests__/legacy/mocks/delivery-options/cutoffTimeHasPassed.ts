import {createCutoffTimeDate} from '../../helpers/createCutoffTimeDate';

/**
 * @param {string} cutoffTime - Timestamp in HH:mm format.
 * @param {import('dayjs').Dayjs} date
 *
 * @returns {import('dayjs').Dayjs}
 */
export function cutoffTimeHasPassed(cutoffTime, date) {
  const cutOffTimeDate = createCutoffTimeDate(cutoffTime, date);

  return !date.isBefore(cutOffTimeDate);
}
