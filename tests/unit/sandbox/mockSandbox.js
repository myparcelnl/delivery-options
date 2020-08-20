import { baseMockApp } from '../baseMockApp';

/**
 * @param {Object} component
 * @param {Object} options
 *
 * @returns {Wrapper}
 */
export function mockSandbox(component = null, options = {}) {
  return baseMockApp('sandbox', component, options, false);
}

/**
 * @param {Object} component
 * @param {Object} options
 *
 * @returns {Wrapper}
 */
export function shallowMockSandbox(component = null, options = {}) {
  return baseMockApp('sandbox', component, options, true);
}
