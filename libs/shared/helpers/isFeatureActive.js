/**
 * @param {string} feature
 * @returns {boolean}
 */
export function isFeatureActive(feature) {
  return Boolean(localStorage.getItem(`features.${feature}`));
}
