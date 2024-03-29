export const createAssetUrl = (path = ''): string => {
  return `https://assets.myparcel.nl/${path.replace(/^\/+/, '')}`;
};
