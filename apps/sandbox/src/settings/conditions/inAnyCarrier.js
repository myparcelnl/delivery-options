import { getCarrierSettingsPath } from '../../delivery-options/src/sandbox/settings/conditions/getCarrierSettingsPath';
import { platformCarrierMap } from '../../delivery-options/src/config/platform/platformCarrierMap';
import { sandboxConfigBus } from '../../delivery-options/src/sandbox/sandboxConfigBus';

/**
 * Match fallback value and any carrier's value.
 *
 * @param {string[] | string} setting - The setting to validate.
 *
 * @returns {Array}
 */
export function inAnyCarrier(setting) {
  const { platform } = sandboxConfigBus;

  return platformCarrierMap[platform].map((carrier) => {
    if (Array.isArray(setting)) {
      return setting.map((setting) => getCarrierSettingsPath(carrier, setting));
    }

    return getCarrierSettingsPath(carrier, setting);
  });
}
