import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {PlatformName} from '@myparcel/constants';

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
export const platformLocaleMap = {
  [PlatformName.MyParcel]: NETHERLANDS,
  [PlatformName.SendMyParcel]: BELGIUM,
};
