import {BELGIUM, NETHERLANDS} from '@myparcel/constants/countries';
import {MYPARCEL, SENDMYPARCEL} from '../../data';

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
export const platformLocaleMap = {
  [MYPARCEL]: NETHERLANDS,
  [SENDMYPARCEL]: BELGIUM,
};
