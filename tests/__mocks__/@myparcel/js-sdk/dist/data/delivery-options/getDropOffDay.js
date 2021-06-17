/**
 * Find the last possible dropoff day for a given delivery day.
 *
 * @param {import('dayjs').Dayjs} deliveryDay
 * @param {String} dropOffDays
 * @returns {import('dayjs').Dayjs}
 */
export function getDropOffDay(deliveryDay, dropOffDays) {
  const dropOffDaysArray = dropOffDays.split(';').map(Number);

  let dropOffDay = deliveryDay.subtract(1, 'day');

  while (!dropOffDaysArray.includes(dropOffDay.weekday())) {
    dropOffDay = dropOffDay.subtract(1, 'day');
  }

  return dropOffDay;
}
