import * as CARRIERS from '@/data/keys/carrierKeys';
import * as PLATFORMS from '@/data/keys/platformKeys';
import { isFeatureActive } from '@/helpers/isFeatureActive';

/**
 * Sandbox override of platformCarrierMap, to be able to hide certain carriers in the settings using feature toggles,
 *  while still allowing them in the delivery options themselves.
 *
 * @see platformCarrierMap
 */
export const sandboxPlatformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    ...isFeatureActive('myparcel.carriers.rjp') ? [CARRIERS.RED_JE_PAKKETJE] : [],
    ...isFeatureActive('myparcel.carriers.dhl') ? [CARRIERS.DHL] : [],
  ],
  [PLATFORMS.SENDMYPARCEL]: [
    CARRIERS.BPOST,
    CARRIERS.DPD,
    CARRIERS.POSTNL,
  ],
};
