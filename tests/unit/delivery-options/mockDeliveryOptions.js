import { baseMockApp } from '../baseMockApp';

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function mockDeliveryOptions(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('delivery-options', component, configBusData, wrapperData, false);
}

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function shallowMockDeliveryOptions(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('delivery-options', component, configBusData, wrapperData, true);
}
