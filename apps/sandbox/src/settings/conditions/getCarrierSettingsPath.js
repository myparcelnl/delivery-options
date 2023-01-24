import {CONFIG} from '@myparcel/delivery-options';

/**
 * @param {...any} setting
 */
export function getCarrierSettingsPath(...setting) {
  return [
    CONFIG.KEY,
    CONFIG.CARRIER_SETTINGS,
    ...setting,
  ].join('.');
}
