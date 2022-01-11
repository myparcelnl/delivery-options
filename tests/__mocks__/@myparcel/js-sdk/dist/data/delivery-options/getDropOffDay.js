/**
 * Find the last possible dropoff day for a given delivery day.
 *
 * @param {import('dayjs').Dayjs} today
 * @param {import('dayjs').Dayjs} deliveryDay
 * @param {string} dropOffDays
 * @returns {import('dayjs').Dayjs}
 */
export function getDropOffDay(today, deliveryDay, dropOffDays) {
  const dropOffDaysArray = dropOffDays.split(';').map(Number);

  if (today.isSame(deliveryDay)) {
    return deliveryDay;
  }

  let dropOffDay = deliveryDay.subtract(1, 'day');

  while (!dropOffDaysArray.includes(dropOffDay.weekday())) {
    dropOffDay = dropOffDay.subtract(1, 'day');
  }

  return dropOffDay;
}
