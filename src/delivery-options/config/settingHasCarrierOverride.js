import { settingsWithCarrierOverride } from '@/data/keys/configKeys';

/**
 * Returns whether given setting can be overridden by carrier settings.
 *
 * @param {String} setting
 *
 * @returns {Boolean}
 */
export function settingHasCarrierOverride(setting) {
  return settingsWithCarrierOverride.includes(setting);
}
