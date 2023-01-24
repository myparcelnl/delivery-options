import {CARRIERS} from '../../data';
import {PLATFORMS} from '../../data';

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    CARRIERS.INSTABOX,
    CARRIERS.DHL,
    CARRIERS.DHL_FOR_YOU,
    CARRIERS.DHL_PARCEL_CONNECT,
    CARRIERS.DHL_EUROPLUS,
  ],
  [PLATFORMS.SENDMYPARCEL]: [
    CARRIERS.BPOST,
    CARRIERS.DPD,
    CARRIERS.POSTNL,
  ],
};
