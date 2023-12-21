import {addDays, getDay, startOfToday} from 'date-fns';
import {DAYS_IN_WEEK} from '@myparcel-do/shared';

/**
 * Return the next date for a given weekday. If the given weekday is today, returns today.
 */
export const createNextDate = (weekday: number): Date => {
  const today = startOfToday();
  const currentWeekday = getDay(today);
  const daysToAdd = (weekday - currentWeekday + DAYS_IN_WEEK) % DAYS_IN_WEEK;

  return addDays(today, daysToAdd);
};
