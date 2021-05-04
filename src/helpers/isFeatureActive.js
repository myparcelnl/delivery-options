/**
 * @param {String} feature
 * @returns {Boolean}
 */
export function isFeatureActive(feature) {
  return Boolean(localStorage.getItem(`features.${feature}`));
}
