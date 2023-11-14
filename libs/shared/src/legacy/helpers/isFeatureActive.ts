export const isFeatureActive = (feature: string): boolean => {
  return Boolean(localStorage.getItem(`features.${feature}`));
};
