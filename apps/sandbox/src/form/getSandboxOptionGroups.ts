import {useMemoize} from '@vueuse/core';
import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  ALLOW_PICKUP_LOCATIONS,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  CUTOFF_TIME_SAME_DAY,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DELAY,
  OptionGroup,
} from '@myparcel-do/shared';
import {type SandboxOptionGroup} from '../types';

export const getSandboxOptionGroups = useMemoize((): SandboxOptionGroup[] => [
  {
    name: OptionGroup.Delivery,
    items: [ALLOW_DELIVERY_OPTIONS],
    hasExpand: true,
    children: [
      {
        name: 'homeDelivery',
        items: [
          ALLOW_MORNING_DELIVERY,
          ALLOW_EVENING_DELIVERY,
          ALLOW_SAME_DAY_DELIVERY,

          ALLOW_MONDAY_DELIVERY,
          ALLOW_SATURDAY_DELIVERY,
        ],
      },
      {
        name: OptionGroup.PackageType,
        items: [ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, ALLOW_PACKAGE_TYPE_MAILBOX],
      },
      {
        name: OptionGroup.ShipmentOption,
        items: [ALLOW_ONLY_RECIPIENT, ALLOW_SIGNATURE],
      },
    ],

    // items: [
    //   ALLOW_DELIVERY_OPTIONS,
    //   ALLOW_PICKUP_LOCATIONS,
    //   ALLOW_MORNING_DELIVERY,
    //   ALLOW_EVENING_DELIVERY,
    //   ALLOW_SAME_DAY_DELIVERY,
    //   ALLOW_MONDAY_DELIVERY,
    //   ALLOW_SATURDAY_DELIVERY,
    // ],
  },

  {
    name: OptionGroup.Pickup,
    items: [ALLOW_PICKUP_LOCATIONS],
  },

  {
    name: OptionGroup.DropOff,
    items: [DROP_OFF_DELAY, DELIVERY_DAYS_WINDOW, CUTOFF_TIME_SAME_DAY],
  },
]);
