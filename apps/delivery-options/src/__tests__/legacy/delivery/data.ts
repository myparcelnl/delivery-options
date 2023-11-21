// Timestamps are before all cutoff times

import {
  ALLOW_DELIVERY_OPTIONS,
  ALLOW_MONDAY_DELIVERY,
  ALLOW_SATURDAY_DELIVERY,
  CARRIER_SETTINGS,
  DELIVERY_DAYS_WINDOW,
  DROP_OFF_DAYS,
  DROP_OFF_DELAY,
  FRIDAY,
  FRIDAY_CUTOFF_TIME,
  MONDAY,
  PLATFORM,
  SATURDAY,
  SATURDAY_CUTOFF_TIME,
  THURSDAY,
  TUESDAY,
  WEDNESDAY,
} from '@myparcel-do/shared';
import {CarrierName, PlatformName} from '@myparcel/constants';

export const DATE_FRIDAY = '2020-03-13T10:00:00Z';

export const DATE_SATURDAY = '2020-03-14T10:00:00Z';

// After all cutoff times
export const DATE_FRIDAY_AFTER_CUTOFF = '2020-03-13T18:00:00Z';

export const DATE_SATURDAY_AFTER_CUTOFF = '2020-03-14T18:00:00Z';

export const configMyParcel = {
  [PLATFORM]: PlatformName.MyParcel,
  [DELIVERY_DAYS_WINDOW]: 7,
  // Includes Saturday
  [DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
  [DROP_OFF_DELAY]: 0,
  [SATURDAY_CUTOFF_TIME]: '14:30',
  [ALLOW_MONDAY_DELIVERY]: true,
};

/**
 * Delivery days window is always the same for SendMyParcel, so it doesn't need to be set.
 *
 * @see @/delivery-options/data/request/requestData:9
 */
export const configSendMyParcel = {
  [PLATFORM]: PlatformName.SendMyParcel,

  // Includes Friday
  [DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
  [DROP_OFF_DELAY]: 0,
  [FRIDAY_CUTOFF_TIME]: '14:30',
  [ALLOW_SATURDAY_DELIVERY]: true,

  [CARRIER_SETTINGS]: {
    [CarrierName.Bpost]: {
      [ALLOW_DELIVERY_OPTIONS]: true,
    },
  },
};
