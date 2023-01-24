/* eslint-disable no-magic-numbers */
import * as CONFIG from '../data/keys/configKeys';
import { capitalize } from '../services/filters/capitalize';
import { configBus } from '../config';
import { getDay } from './getDay';

/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 *
 * @param {string} locale - Optional locale override.
 *
 * @returns {string[]}
 */
export const getWeekdays = (locale = configBus.get(CONFIG.LOCALE)) => {
  const dates = [];

  for (let day = 5; day <= 11; day++) {
    let date = getDay(new Date(1970, 0, day), locale);

    // Uppercase first letter.
    date = capitalize(date);

    dates.push(date);
  }

  return dates;
};
