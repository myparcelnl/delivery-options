import {CarrierName, PlatformName} from '@myparcel/constants';
import {type SupportedPlatformName} from '../../../types';

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap: Record<SupportedPlatformName, CarrierName[]> = {
  [PlatformName.MyParcel as const]: [
    CarrierName.PostNl as const,
    CarrierName.Dhl as const,
    CarrierName.DhlForYou as const,
    CarrierName.DhlParcelConnect as const,
    CarrierName.DhlEuroPlus as const,
  ],
  [PlatformName.SendMyParcel as const]: [
    CarrierName.Bpost as const,
    CarrierName.Dpd as const,
    CarrierName.PostNl as const,
  ],
};
