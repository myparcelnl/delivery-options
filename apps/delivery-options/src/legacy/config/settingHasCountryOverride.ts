import {settingsWithCountryOverrides} from '@myparcel-do/shared';

/**
 * Returns whether the given setting can be set per country.
 *
 * @param {string} setting
 *
 * @returns {boolean}
 */
export function settingHasCountryOverride(setting) {
  return settingsWithCountryOverrides.includes(setting);
}
