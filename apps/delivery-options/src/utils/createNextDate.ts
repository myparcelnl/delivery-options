import {addDays, getDay} from 'date-fns';
import {DAYS_IN_WEEK} from '@myparcel-dev/do-shared';
import {createUtcDate} from './createUtcDate';

/**
 * Return the next date for a given weekday. If the given weekday is today, returns today.
 */
export const createNextDate = (weekday: number): Date => {
  const date = createUtcDate();

  if (getDay(date) === weekday) {
    return date;
  }

  return addDays(date, (weekday + DAYS_IN_WEEK - getDay(date)) % DAYS_IN_WEEK);
};
