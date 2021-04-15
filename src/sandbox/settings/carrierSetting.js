import * as CONFIG from '@/data/keys/configKeys';
import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { platformCarrierMap } from '@/config/platformConfig';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

/**
 * Transform a given setting into a form setting entry. Item is not processed if it's not allowed in given platform.
 *
 * @param {Object} setting - Setting to transform.
 * @param {MyParcel.Platform} platform
 *
 * @returns {Object[][]}
 */
export function carrierSetting(setting, platform) {
  return sandboxConfigBus.carrierData.reduce((acc, carrier) => {
    const platformCarrierPermissions = platformCarrierMap[platform];
    const currentCarrierConfig = CarrierConfigurationFactory.create(carrier.name);

    const allowedInPlatform = platformCarrierPermissions && platformCarrierPermissions.includes(carrier.name);
    const allowedInCarrier = currentCarrierConfig.hasFeature(setting.name);

    if (allowedInPlatform && allowedInCarrier) {
      return [
        ...acc,
        {
          ...setting,
          key: `${CONFIG.KEY}.${CONFIG.CARRIER_SETTINGS}.${carrier.name}`,
          carrier: {
            name: carrier.name,
            text: carrier.label,
            image: carrier.image,
          },
        },
      ];
    }

    return acc;
  }, []);
}
