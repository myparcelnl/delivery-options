import {CARRIERS, PLATFORMS} from '@myparcel-do/shared';

/**
 * Sandbox override of platformCarrierMap, to be able to hide certain carriers in the settings using feature toggles,
 *  while still allowing them in the delivery options themselves.
 *
 * @see platformCarrierMap
 */
export const sandboxPlatformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    CARRIERS.DHL,
    CARRIERS.DHL_FOR_YOU,
    CARRIERS.DHL_PARCEL_CONNECT,
    CARRIERS.DHL_EUROPLUS,
    CARRIERS.DPD,
    CARRIERS.UPS,
  ],
  [PLATFORMS.SENDMYPARCEL]: [CARRIERS.BPOST, CARRIERS.DPD, CARRIERS.POSTNL],
};
