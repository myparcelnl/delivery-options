/**
 * @param {string} time
 *
 * @returns {boolean}
 */
export function isPastTime(time) {
  const [hour, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minutes);

  return date <= new Date();
}
