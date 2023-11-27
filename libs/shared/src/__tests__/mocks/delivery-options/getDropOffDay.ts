/**
 * Find the last possible dropoff day for a given delivery day.
 *
 * @param {import('dayjs').Dayjs} today
 * @param {import('dayjs').Dayjs} deliveryDay
 * @param {number[]} dropOffDays
 * @returns {import('dayjs').Dayjs}
 */
export function getDropOffDay(today, deliveryDay, dropOffDays) {
  if (today.isSame(deliveryDay)) {
    return deliveryDay;
  }

  let dropOffDay = deliveryDay.subtract(1, 'day');

  while (!dropOffDays.includes(dropOffDay.day())) {
    dropOffDay = dropOffDay.subtract(1, 'day');
  }

  return dropOffDay;
}
