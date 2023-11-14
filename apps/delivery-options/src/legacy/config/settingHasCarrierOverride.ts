import {settingsWithCarrierOverride} from '@myparcel-do/shared';

/**
 * Returns whether given setting can be overridden by carrier settings.
 *
 * @param {string} setting
 *
 * @returns {boolean}
 */
export function settingHasCarrierOverride(setting) {
  return settingsWithCarrierOverride.includes(setting);
}
