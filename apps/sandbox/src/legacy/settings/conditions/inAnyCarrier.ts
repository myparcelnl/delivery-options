import {platformCarrierMap} from '@myparcel-do/shared';
import {getCarrierSettingsPath} from './getCarrierSettingsPath';

/**
 * Match fallback value and any carrier's value.
 *
 * @param {string[] | string} setting - The setting to validate.
 *
 * @returns {Array}
 */
export function inAnyCarrier(setting) {
  const {platform} = sandboxConfigBus;

  return platformCarrierMap[platform].map((carrier) => {
    if (Array.isArray(setting)) {
      return setting.map((setting) => getCarrierSettingsPath(carrier, setting));
    }

    return getCarrierSettingsPath(carrier, setting);
  });
}
