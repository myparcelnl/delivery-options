import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';

/**
 * All settings are enabled by default, this object is used to turn off settings individually.
 *
 * @type {Object<MyParcel.CarrierName, Object>}
 */
export const defaultCarrierConfig = {
  [CARRIERS.POSTNL]: {
    [CONFIG.ALLOW_SATURDAY_DELIVERY]: false,
  },
  [CARRIERS.BPOST]: {
    [CONFIG.ALLOW_MORNING_DELIVERY]: false,
    [CONFIG.ALLOW_EVENING_DELIVERY]: false,
    [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
    [CONFIG.ALLOW_ONLY_RECIPIENT]: false,
    [CONFIG.ALLOW_SIGNATURE]: false,
    [CONFIG.ALLOW_PICKUP_EXPRESS]: false,
  },
  [CARRIERS.DPD]: {
    [CONFIG.ALLOW_MORNING_DELIVERY]: false,
    [CONFIG.ALLOW_EVENING_DELIVERY]: false,
    [CONFIG.ALLOW_MONDAY_DELIVERY]: false,
    [CONFIG.ALLOW_ONLY_RECIPIENT]: false,
    [CONFIG.ALLOW_PICKUP_EXPRESS]: false,
  },
};
