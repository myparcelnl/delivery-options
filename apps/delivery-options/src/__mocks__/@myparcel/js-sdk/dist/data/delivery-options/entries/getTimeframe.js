/**
 * @param {string} date
 * @param {string} type
 *
 * @returns {MyParcelDeliveryOptions.DeliveryTimeFrame}
 */
export function getTimeframe(date, type) {
  return {
    type,
    date_time: {
      date,
      timezone_type: 3,
      timezone: 'Europe/Amsterdam',
    },
  };
}
