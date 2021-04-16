import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';

/**
 * Get the default configuration for a carrier. Allows overrides.
 *
 * @param {MyParcel.CarrierName} carrier
 * @param {Object} override
 *
 * @returns {null|Object<MyParcel.CarrierName, Object>}
 */
export function getDefaultCarrierConfig(carrier, override = {}) {
  const carrierConfiguration = CarrierConfigurationFactory.create(carrier);
  const defaultConfig = carrierConfiguration.getDefaultConfig();

  if (Object.keys(defaultConfig).length) {
    return {
      [carrier]: {
        ...defaultConfig,
        ...override,
      },
    };
  }

  return null;
}
