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
    CARRIERS.RED_JE_PAKKETJE,
    CARRIERS.DHL,
  ],
  [PLATFORMS.SENDMYPARCEL]: [
    CARRIERS.BPOST,
    CARRIERS.DPD,
    CARRIERS.POSTNL,
  ],
};
