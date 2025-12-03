import {format} from 'date-fns';
import {type DeliveryOption} from '@myparcel-dev/sdk';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel-dev/constants';
import {createDeliveryTimeframe} from '../../../utils';
import {createTimestamp} from '../../../../utils';
import {DELIVERY_TIMEFRAME_TYPE_END, DELIVERY_TIMEFRAME_TYPE_START} from '../../../../data';
import {getShipmentOptions} from './getShipmentOptions';

export const getDeliveryOptionsEntry = (
  today: Date,
  isExtraDropOffDay: boolean,
  isSameDay = false,
  hasExpressDelivery = false,
): DeliveryOption => {
  const formattedDate = format(today, 'yyyy-MM-dd');

  return {
    date: createTimestamp(`${formattedDate} 00:00:00.000000`),
    possibilities: [
      // @ts-expect-error todo
      ...(isExtraDropOffDay
        ? []
        : [
            {
              type: DeliveryTypeName.Morning,
              package_type: PackageTypeName.Package,
              delivery_time_frames: [
                createDeliveryTimeframe(`${formattedDate} 8:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_START),
                createDeliveryTimeframe(`${formattedDate} 12:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_END),
              ],
              shipment_options: getShipmentOptions([ShipmentOptionName.OnlyRecipient]),
            },
          ]),

      // @ts-expect-error todo
      ...(isExtraDropOffDay
        ? []
        : [
            {
              type: DeliveryTypeName.Evening,
              package_type: PackageTypeName.Package,
              delivery_time_frames: [
                createDeliveryTimeframe(`${formattedDate} 18:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_START),
                createDeliveryTimeframe(`${formattedDate} 22:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_END),
              ],
              shipment_options: getShipmentOptions([ShipmentOptionName.OnlyRecipient]),
            },
          ]),

      {
        type: DeliveryTypeName.Standard,
        package_type: PackageTypeName.Package,
        delivery_time_frames: [
          // @ts-expect-error todo
          createDeliveryTimeframe(`${formattedDate} 08:30:00.000000`, DELIVERY_TIMEFRAME_TYPE_START),
          // @ts-expect-error todo
          createDeliveryTimeframe(`${formattedDate} 18:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_END),
        ],
        shipment_options: getShipmentOptions(isSameDay ? [ShipmentOptionName.SameDayDelivery] : []),
      },

      ...(hasExpressDelivery
        ? [
            {
              type: DeliveryTypeName.Express,
              package_type: PackageTypeName.Package,
              delivery_time_frames: [
                // @ts-expect-error todo
                createDeliveryTimeframe(`${formattedDate} 08:30:00.000000`, DELIVERY_TIMEFRAME_TYPE_START),
                // @ts-expect-error todo
                createDeliveryTimeframe(`${formattedDate} 18:00:00.000000`, DELIVERY_TIMEFRAME_TYPE_END),
              ],
              shipment_options: [],
            },
          ]
        : []),
    ],
  };
};
