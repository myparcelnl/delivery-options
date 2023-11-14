import {CONFIG, KEY_CONFIG} from '@myparcel-do/shared';

/**
 * @param {...any} setting
 */
export function getCarrierSettingsPath(...setting) {
  return [KEY_CONFIG, CONFIG.CARRIER_SETTINGS, ...setting].join('.');
}
