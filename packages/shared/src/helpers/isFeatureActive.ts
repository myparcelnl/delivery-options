/**
 * Checks if a feature is activated via localStorage.
 */
export const isFeatureActive = (feature: string): boolean => {
  return Boolean(localStorage.getItem(`features.${feature}`));
};
