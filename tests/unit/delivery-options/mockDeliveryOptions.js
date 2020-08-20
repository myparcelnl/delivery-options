import { baseMockApp } from '../baseMockApp';

/**
 * @param {Object} component
 * @param {Object} options
 *
 * @returns {Wrapper}
 */
export function mockDeliveryOptions(component = null, options = {}) {
  return baseMockApp('delivery-options', component, options, false);
}

/**
 * @param {Object} component
 * @param {Object} options
 *
 * @returns {Wrapper}
 */
export function shallowMockDeliveryOptions(component = null, options = {}) {
  return baseMockApp('delivery-options', component, options, true);
}
