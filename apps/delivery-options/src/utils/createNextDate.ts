import {addDays, getDay} from 'date-fns';
import {createUtcDate} from './createUtcDate';

/**
 * Return the next date for a given weekday. If the given weekday is today, returns today.
 */
export const createNextDate = (weekday: number): Date => {
  const date = createUtcDate();

  if (getDay(date) === weekday) {
    return date;
  }

  return addDays(date, (weekday + 7 - getDay(date)) % 7);
};
