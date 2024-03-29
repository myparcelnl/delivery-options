// Timestamps are before all cutoff times
import * as CONFIG from '@/data/keys/configKeys';
import { FRIDAY, MONDAY, SATURDAY, THURSDAY, TUESDAY, WEDNESDAY } from '@/config/extraDeliveryConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { BPOST } from '@/data/keys/carrierKeys';

export const DATE_FRIDAY = '2020-03-13T10:00:00Z';
export const DATE_SATURDAY = '2020-03-14T10:00:00Z';

// After all cutoff times
export const DATE_FRIDAY_AFTER_CUTOFF = '2020-03-13T18:00:00Z';
export const DATE_SATURDAY_AFTER_CUTOFF = '2020-03-14T18:00:00Z';

export const configMyParcel = {
  [CONFIG.PLATFORM]: MYPARCEL,
  [CONFIG.DELIVERY_DAYS_WINDOW]: 7,
  // Includes Saturday
  [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
};

/**
 * Delivery days window is always the same for SendMyParcel, so it doesn't need to be set.
 *
 * @see @/delivery-options/data/request/requestData:9
 */
export const configSendMyParcel = {
  [CONFIG.PLATFORM]: SENDMYPARCEL,

  // Includes Friday
  [CONFIG.DROP_OFF_DAYS]: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY],
  [CONFIG.DROP_OFF_DELAY]: 0,
  [CONFIG.FRIDAY_CUTOFF_TIME]: '14:30',
  [CONFIG.ALLOW_SATURDAY_DELIVERY]: true,

  [CONFIG.CARRIER_SETTINGS]: {
    [BPOST]: {
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
    },
  },
};
