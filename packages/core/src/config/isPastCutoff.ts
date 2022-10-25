/**
 * @param {string} time
 *
 * @returns {boolean}
 */
export function isPastCutoff(time) {
  const [hour, minutes] = time.split(':').map(Number);
  const cutoffDateTime = new Date();
  cutoffDateTime.setHours(hour);
  cutoffDateTime.setMinutes(minutes);

  return cutoffDateTime <= new Date();
}
