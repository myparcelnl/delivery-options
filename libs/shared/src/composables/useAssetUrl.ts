export const useAssetUrl = (path = ''): string => {
  return `https://assets.myparcel.nl/${path}`.replace(/\/+/g, '/');
};
