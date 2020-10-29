import { defaultCarrierConfig } from '@/data/defaultCarrierConfig';

/**
 * Get the default configuration for a carrier. Allows overrides.
 *
 * @param {MyParcel.CarrierName} carrier
 * @param {Object} override
 *
 * @returns {Object<MyParcel.CarrierName, Object>}
 */
export function getDefaultCarrierConfig(carrier, override = {}) {
  return {
    [carrier]: {
      ...defaultCarrierConfig[carrier],
      ...override,
    },
  };
}
