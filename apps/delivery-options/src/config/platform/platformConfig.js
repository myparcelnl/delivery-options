import * as LOCALE from '../../config/localeConfig';
import { platformLocaleMap } from './platformLocaleMap';

/**
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export function platformConfig(platform) {
  return LOCALE.CONFIG_MAP[platformLocaleMap[platform]];
}
