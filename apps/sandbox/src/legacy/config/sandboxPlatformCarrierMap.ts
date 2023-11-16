import {CarrierName, PlatformName} from '@myparcel/constants';

/**
 * Sandbox override of platformCarrierMap, to be able to hide certain carriers in the settings using feature toggles,
 *  while still allowing them in the delivery options themselves.
 *
 * @see platformCarrierMap
 */
export const sandboxPlatformCarrierMap = {
  [PlatformName.MyParcel]: [
    CarrierName.PostNl,
    CarrierName.Dhl,
    CarrierName.DhlForYou,
    CarrierName.DhlParcelConnect,
    CarrierName.DhlEuroPlus,
    CarrierName.Dpd,
    CarrierName.Ups,
  ],
  [PlatformName.SendMyParcel]: [CarrierName.Bpost, CarrierName.Dpd, CarrierName.PostNl],
};
