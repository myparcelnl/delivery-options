import { CarrierConfigurationFactory } from '@/data/carriers/carrierConfigurationFactory';

/**
 * Get the default configuration for a carrier. Allows overrides.
 *
 * @param {MyParcel.CarrierName} carrier
 * @param {Object} override
 *
 * @returns {Object<MyParcel.CarrierName, Object>}
 */
export function getDefaultCarrierConfig(carrier, override = {}) {
  const carrierConfiguration = CarrierConfigurationFactory.create(carrier);

  return {
    [carrier]: {
      ...carrierConfiguration.getDefaultConfig(),
      ...override,
    },
  };
}
