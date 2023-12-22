// Timestamps are before all cutoff times

import {
  CarrierSetting,
  ConfigSetting,
  DeprecatedCarrierSetting,
  FRIDAY,
  KEY_CARRIER_SETTINGS,
  MONDAY,
  SATURDAY,
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
  [ConfigSetting.Platform]: PlatformName.MyParcel,
  [CarrierSetting.DeliveryDaysWindow]: 7,
  // Includes Saturday
  [CarrierSetting.DropOffDays]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
  [CarrierSetting.DropOffDelay]: 0,
  [DeprecatedCarrierSetting.SaturdayCutoffTime]: '14:30',
  [CarrierSetting.AllowMondayDelivery]: true,
};

/**
 * Delivery days window is always the same for SendMyParcel, so it doesn't need to be set.
 *
 * @see @/delivery-options/data/request/requestData:9
 */
export const configSendMyParcel = {
  [ConfigSetting.Platform]: PlatformName.SendMyParcel,

  // Includes Friday
  [CarrierSetting.DropOffDays]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
  [CarrierSetting.DropOffDelay]: 0,
  [DeprecatedCarrierSetting.FridayCutoffTime]: '14:30',
  [CarrierSetting.AllowSaturdayDelivery]: true,

  [KEY_CARRIER_SETTINGS]: {
    [CarrierName.Bpost]: {
      [CarrierSetting.AllowDeliveryOptions]: true,
    },
  },
};
