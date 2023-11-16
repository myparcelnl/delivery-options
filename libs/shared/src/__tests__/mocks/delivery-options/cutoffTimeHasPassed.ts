import {createCutoffTimeDate} from '../../legacy';

/**
 * @param {string} cutoffTime - Timestamp in HH:mm format.
 * @param {import('dayjs').Dayjs} date
 *
 * @returns {import('dayjs').Dayjs}
 */
export const cutoffTimeHasPassed = (cutoffTime, date) => {
  const cutOffTimeDate = createCutoffTimeDate(cutoffTime, date);

  return !date.isBefore(cutOffTimeDate);
};
