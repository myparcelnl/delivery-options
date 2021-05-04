import * as PLATFORMS from '@/data/keys/platformKeys';
import { countryCodes } from '@/data/keys/countryCodes';

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
export const platformLocaleMap = {
  [PLATFORMS.MYPARCEL]: countryCodes.NETHERLANDS,
  [PLATFORMS.SENDMYPARCEL]: countryCodes.BELGIUM,
};
