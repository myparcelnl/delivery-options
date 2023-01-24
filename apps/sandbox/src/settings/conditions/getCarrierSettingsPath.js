import * as CONFIG from '@/data/keys/configKeys';

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
