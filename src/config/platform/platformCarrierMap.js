import * as CARRIERS from '@/data/keys/carrierKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
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
