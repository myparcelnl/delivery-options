import {type SupportedPlatformName} from '@myparcel-do/shared';
import {type CarrierName} from '@myparcel/constants';
import {CARRIERS, PLATFORMS} from '../../data';

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap: Record<SupportedPlatformName, CarrierName[]> = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    CARRIERS.DHL,
    CARRIERS.DHL_FOR_YOU,
    CARRIERS.DHL_PARCEL_CONNECT,
    CARRIERS.DHL_EUROPLUS,
  ],
  [PLATFORMS.SENDMYPARCEL]: [CARRIERS.BPOST, CARRIERS.DPD, CARRIERS.POSTNL],
};
