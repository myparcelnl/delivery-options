import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_EVENING_DELIVERY,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_MORNING_DELIVERY,
  ALLOW_ONLY_RECIPIENT,
  ALLOW_PACKAGE_TYPE_DIGITAL_STAMP,
  ALLOW_PACKAGE_TYPE_MAILBOX,
  ALLOW_SAME_DAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  ALLOW_SIGNATURE,
  CUTOFF_TIME_SAME_DAY,
  DROP_OFF_DELAY,
  FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW,
  FEATURE_PICKUP_SHOW_DISTANCE,
  FEATURE_SHOW_DELIVERY_DATE,
} from '@myparcel-do/shared';
import {type SandboxOptionGroup} from '../types';

export const optionGroupMap = [
  {
    name: OptionGroup.Delivery,
    items: [ALLOW_DELIVERY_OPTIONS],
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
    name: OptionGroup.ShipmentOption,
    items: [ALLOW_ONLY_RECIPIENT, ALLOW_SIGNATURE],
  },
  {
    name: OptionGroup.PackageType,
    items: [ALLOW_PACKAGE_TYPE_DIGITAL_STAMP, ALLOW_PACKAGE_TYPE_MAILBOX],
  },
  {
    name: OptionGroup.DropOff,
    items: [DROP_OFF_DELAY, CUTOFF_TIME_SAME_DAY],
  },
  {
    name: OptionGroup.Feature,
    items: [FEATURE_SHOW_DELIVERY_DATE, FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW, FEATURE_PICKUP_SHOW_DISTANCE],
  },
] satisfies SandboxOptionGroup[];
