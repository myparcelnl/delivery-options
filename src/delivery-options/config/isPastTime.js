/**
 * @param {string} time
 *
 * @returns {boolean}
 */
export function isPastTime(time) {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const [hour, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minutes);

  return date <= new Date();
}
