import {getDay, isSameDay, subDays} from 'date-fns';
import {type Weekday} from '../../../types';

/**
 * Find the last possible dropoff day for a given delivery day.
 */
export const getDropOffDay = (today: Date, deliveryDay: Date, dropOffDays: Weekday[]): Date => {
  if (isSameDay(today, deliveryDay)) {
    return deliveryDay;
  }

  let dropOffDay = subDays(deliveryDay, 1);

  while (!dropOffDays.includes(getDay(dropOffDay))) {
    dropOffDay = subDays(dropOffDay, 1);
  }

  return dropOffDay;
};
