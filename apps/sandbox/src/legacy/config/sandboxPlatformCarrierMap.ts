import {CarrierName, PlatformName} from '@myparcel/constants';

/**
 * Sandbox override of platformCarrierMap, to be able to hide certain carriers in the settings using feature toggles,
 *  while still allowing them in the delivery options themselves.
 *
 * @see platformCarrierMap
 */
export const sandboxPlatformCarrierMap = {
  [PlatformName.MyParcel as const]: [
    CarrierName.PostNl as const,
    CarrierName.Dhl as const,
    CarrierName.DhlForYou as const,
    CarrierName.DhlParcelConnect as const,
    CarrierName.DhlEuroPlus as const,
    CarrierName.Dpd as const,
    CarrierName.Ups as const,
  ],
  [PlatformName.SendMyParcel as const]: [
    CarrierName.Bpost as const,
    CarrierName.Dpd as const,
    CarrierName.PostNl as const,
  ],
};
