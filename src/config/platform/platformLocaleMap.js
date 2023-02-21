import * as PLATFORMS from '@/data/keys/platformKeys';
import {NETHERLANDS, BELGIUM} from '@myparcel/js-sdk/dist/constant/countries-iso2';

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
export const platformLocaleMap = {
  [PLATFORMS.MYPARCEL]: NETHERLANDS,
  [PLATFORMS.SENDMYPARCEL]: BELGIUM,
};
