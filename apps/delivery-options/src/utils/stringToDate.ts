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
   * Split the time into individual components and convert them to numbers.
   *
   * @example ['08', '00', '00'] -> [8, 0, 0]
   */
  const [hours, minutes, seconds] = timeWithoutDate.split(':').map(Number);

  /**
   * Create a Date object using the parsed year, adjusted month, day, hours, minutes, and seconds.
   * This avoids any timezone adjustments, treating the input as a plain date and time.
   *
   * @example new Date(2019, 9, 15, 8, 0, 0)
   */
  return new Date(parseInt(dateArr[0]), parseInt(dateArr[1]), parseInt(dateArr[2]), hours, minutes, seconds);
};
