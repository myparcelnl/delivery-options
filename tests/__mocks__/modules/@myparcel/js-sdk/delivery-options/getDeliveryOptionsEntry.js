/**
 * @param {Object} today - Dayjs date.
 * @param {Boolean} isExtraDropOffDay
 *
 * @returns {Object}
 */
export function getDeliveryOptionsEntry(today, isExtraDropOffDay) {
  const formattedDate = today.format('YYYY-MM-DD');

  return {
    date: {
      date: `${formattedDate} 00:00:00.000000`,
      timezone_type: 3,
      timezone: 'Europe/Amsterdam',
    },
    possibilities: [
      ...isExtraDropOffDay
        ? []
        : [{
          type: 'morning',
          package_type: 'package',
          delivery_time_frames: [
            {
              type: 'start',
              date_time: {
                date: `${formattedDate} 08:00:00.000000`,
                timezone_type: 3,
                timezone: 'Europe/Amsterdam',
              },
            },
            {
              type: 'end',
              date_time: {
                date: `${formattedDate} 12:00:00.000000`,
                timezone_type: 3,
                timezone: 'Europe/Amsterdam',
              },
            },
          ],
          shipment_options: [
            {
              name: 'large_format',
              schema: {
                type: 'boolean',
                enum: [
                  true,
                  false,
                ],
              },
            },
            {
              name: 'only_recipient',
              schema: {
                type: 'boolean',
                enum: [
                  true,
                ],
              },
            },
            {
              name: 'signature',
              schema: {
                type: 'boolean',
                enum: [
                  true,
                  false,
                ],
              },
            },
            {
              name: 'return',
              schema: {
                type: 'boolean',
                enum: [
                  true,
                  false,
                ],
              },
            },
          ],
        }],
      {
        type: 'standard',
        package_type: 'package',
        delivery_time_frames: [
          {
            type: 'start',
            date_time: {
              date: `${formattedDate} 08:30:00.000000`,
              timezone_type: 3,
              timezone: 'Europe/Amsterdam',
            },
          },
          {
            type: 'end',
            date_time: {
              date: `${formattedDate} 21:30:00.000000`,
              timezone_type: 3,
              timezone: 'Europe/Amsterdam',
            },
          },
        ],
        shipment_options: [
          {
            name: 'age_check',
            schema: {
              type: 'boolean',
              enum: [
                true,
                false,
              ],
            },
          },
          {
            name: 'large_format',
            schema: {
              type: 'boolean',
              enum: [
                true,
                false,
              ],
            },
          },
          {
            name: 'only_recipient',
            schema: {
              type: 'boolean',
              enum: [
                true,
                false,
              ],
            },
          },
          {
            name: 'signature',
            schema: {
              type: 'boolean',
              enum: [
                true,
                false,
              ],
            },
          },
          {
            name: 'return',
            schema: {
              type: 'boolean',
              enum: [
                true,
                false,
              ],
            },
          },
        ],
      },
    ],
  };
}
