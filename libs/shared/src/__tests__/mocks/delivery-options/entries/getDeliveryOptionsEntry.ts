import {type Dayjs} from 'dayjs';
import {type DeliveryOption} from '@myparcel/sdk';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {getTimeframe} from './getTimeframe';
import {getShipmentOptions} from './getShipmentOptions';

export const getDeliveryOptionsEntry = (
  today: Dayjs,
  isExtraDropOffDay: boolean,
  isSameDay = false,
): DeliveryOption => {
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
              type: DeliveryTypeName.Morning,
              package_type: PackageTypeName.Package,
              delivery_time_frames: [
                getTimeframe(`${formattedDate} 8:00:00.000000`, 'start'),
                getTimeframe(`${formattedDate} 12:00:00.000000`, 'end'),
              ],
              shipment_options: getShipmentOptions([ShipmentOptionName.OnlyRecipient]),
            },
          ]),

      ...(isExtraDropOffDay
        ? []
        : [
            {
              type: DeliveryTypeName.Evening,
              package_type: PackageTypeName.Package,
              delivery_time_frames: [
                getTimeframe(`${formattedDate} 18:00:00.000000`, 'start'),
                getTimeframe(`${formattedDate} 22:00:00.000000`, 'end'),
              ],
              shipment_options: getShipmentOptions([ShipmentOptionName.OnlyRecipient]),
            },
          ]),

      {
        type: DeliveryTypeName.Standard,
        package_type: PackageTypeName.Package,
        delivery_time_frames: [
          getTimeframe(`${formattedDate} 08:30:00.000000`, 'start'),
          getTimeframe(`${formattedDate} 21:30:00.000000`, 'end'),
        ],
        shipment_options: getShipmentOptions(isSameDay ? [ShipmentOptionName.SameDayDelivery] : []),
      },
    ],
  };
};
