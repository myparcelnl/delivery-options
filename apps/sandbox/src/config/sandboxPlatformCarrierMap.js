import {CARRIERS} from '@myparcel/delivery-options';
import {PLATFORMS} from '@myparcel/delivery-options';
import { isFeatureActive } from '../../delivery-options/src/helpers/isFeatureActive';

/**
 * Sandbox override of platformCarrierMap, to be able to hide certain carriers in the settings using feature toggles,
 *  while still allowing them in the delivery options themselves.
 *
 * @see platformCarrierMap
 */
export const sandboxPlatformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [
    CARRIERS.POSTNL,
    ...isFeatureActive('myparcel.carriers.rjp') ? [CARRIERS.INSTABOX] : [],
    ...isFeatureActive('myparcel.carriers.dhl') ? [CARRIERS.DHL] : [],
  ],
  [PLATFORMS.SENDMYPARCEL]: [
    CARRIERS.BPOST,
    CARRIERS.DPD,
    CARRIERS.POSTNL,
  ],
};
