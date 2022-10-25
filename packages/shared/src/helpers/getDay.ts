/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 *
 * @param {Date} date
 * @param {string} locale - Optional locale override.
 *
 * @returns {string}
 */
export const getDay = (date: Date, locale: string): string => {
  return date.toLocaleString(
    locale,
    {weekday: 'long'},
  );
};
