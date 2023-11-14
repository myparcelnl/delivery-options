import {getTimeframe} from './getTimeframe';
import {getShipmentOptions} from './getShipmentOptions';

/**
 * @param {import('dayjs').Dayjs} today
 * @param {boolean} isExtraDropOffDay
 * @param {boolean} isSameDay
 *
 * @returns {Object}
 */
export function getDeliveryOptionsEntry(today, isExtraDropOffDay, isSameDay = false) {
  const formattedDate = today.format('YYYY-MM-DD');

  return {
    date: {
      date: `${formattedDate} 00:00:00.000000`,
      timezone_type: 3,
      timezone: 'Europe/Amsterdam',
    },
    possibilities: [
      ...(isExtraDropOffDay
        ? []
        : [
            {
              type: 'morning',
              package_type: 'package',
              delivery_time_frames: [
                getTimeframe(`${formattedDate} 8:00:00.000000`, 'start'),
                getTimeframe(`${formattedDate} 12:00:00.000000`, 'end'),
              ],
              shipment_options: getShipmentOptions(['only_recipient']),
            },
          ]),
      ...(isExtraDropOffDay
        ? []
        : [
            {
              type: 'evening',
              package_type: 'package',
              delivery_time_frames: [
                getTimeframe(`${formattedDate} 18:00:00.000000`, 'start'),
                getTimeframe(`${formattedDate} 22:00:00.000000`, 'end'),
              ],
              shipment_options: getShipmentOptions(['only_recipient']),
            },
          ]),
      {
        type: 'standard',
        package_type: 'package',
        delivery_time_frames: [
          getTimeframe(`${formattedDate} 08:30:00.000000`, 'start'),
          getTimeframe(`${formattedDate} 21:30:00.000000`, 'end'),
        ],
        shipment_options: getShipmentOptions(isSameDay ? ['same_day_delivery'] : []),
      },
    ],
  };
}
