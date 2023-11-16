import {CarrierName, PlatformName} from '@myparcel/constants';
import {type SupportedPlatformName} from '../../../types';

/**
 * Maps platforms to their available carriers.
 *
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap: Record<SupportedPlatformName, CarrierName[]> = {
  [PlatformName.MyParcel]: [
    CarrierName.PostNl,
    CarrierName.Dhl,
    CarrierName.DhlForYou,
    CarrierName.DhlParcelConnect,
    CarrierName.DhlEuroPlus,
  ],
  [PlatformName.SendMyParcel]: [CarrierName.Bpost, CarrierName.Dpd, CarrierName.PostNl],
};
