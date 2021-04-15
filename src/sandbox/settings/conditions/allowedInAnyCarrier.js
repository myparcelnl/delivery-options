import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';
import { platformCarrierMap } from '@/config/platformConfig';

/**
 * Pass given data in an array if setting(s) are allowed in any carrier of the current platform.
 *
 * @param {String|String[]} settings
 * @param {String} data - Form data.
 * @param {MyParcel.Platform} platform
 *
 * @returns {Array}
 */
export const allowedInAnyCarrier = (settings, data, platform) => {
  const allowed = platformCarrierMap[platform].some((carrier) => {
    const carrierConfig = CarrierConfigurationFactory.create(carrier);

    if (Array.isArray(settings)) {
      return settings.every((setting) => carrierConfig.hasFeature(setting));
    }

    return carrierConfig.hasFeature(settings);
  });

  return allowed ? [data] : [];
};
