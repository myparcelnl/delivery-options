import { getCarrierSettingsPath } from '@/sandbox/settings/conditions/getCarrierSettingsPath';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';
import { platformCarrierMap } from '@/config/platform/platformCarrierMap';

/**
 * Match fallback value and any carrier's value.
 *
 * @param {String[]|String} setting - The setting to validate.
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
