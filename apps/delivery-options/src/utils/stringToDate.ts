/**
 * Index where the date ends, before the time starts.
 */
const DATE_LENGTH = 10;

/**
 * Convert a date string from the MyParcel API to a timezone ignorant date.
 */
export const stringToDate = (date: string): Date => {
  /**
   * The date string with the time stripped off.
   *
   * @example 2019-10-15
   */
  const dateWithoutTime = date.substring(0, DATE_LENGTH);

  /**
   * Because months are 0-based we need to subtract 1 to get the correct month.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Parameters
   */
  const dateArr: string[] = dateWithoutTime.split('-');

  dateArr[1] = (parseInt(dateArr[1]) - 1).toString();

  /**
   * The rest of the string, so only the time.
   *
   * @example 08:00:00.000000
   */
  const timeWithoutDate = date.substring(DATE_LENGTH + 1, date.length);

  /**
   * Split the date and time, passing the year, month, day, hours, minutes and seconds as arguments to Date.UTC to
   *  create a UTC date.
   *
   * @example 2019 10 15 17 00 00.000000 -> 1573837200000
   */
  // @ts-expect-error todo
  const utcDate = Date.UTC(...dateArr, ...timeWithoutDate.split(':'));

  return new Date(utcDate);
};
