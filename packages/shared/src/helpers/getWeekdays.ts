/* eslint-disable no-magic-numbers */
import {capitalize} from '../services/filters/capitalize';
import {getDay} from './getDay';

/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 */
export const getWeekdays = (locale: string): string[] => {
  const dates = [];

  for (let day = 5; day <= 11; day++) {
    let date = getDay(new Date(1970, 0, day), locale);

    // Uppercase first letter.
    date = capitalize(date);

    dates.push(date);
  }

  return dates;
};