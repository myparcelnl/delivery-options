import { baseMockApp } from '../baseMockApp';

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function mockSandbox(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('sandbox', component, configBusData, wrapperData, false);
}

/**
 * @param {Object} configBusData
 * @param {Object} wrapperData
 * @param {Object} component
 * @returns {Wrapper}
 */
export function shallowMockSandbox(configBusData = null, wrapperData = null, component = null) {
  return baseMockApp('sandbox', component, configBusData, wrapperData, true);
}
