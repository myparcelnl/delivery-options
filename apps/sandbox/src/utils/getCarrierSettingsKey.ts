export const getCarrierSettingsKey = (name: string, carrier?: string): string => {
  const nameParts = name.split('.');

  if (nameParts.length > 1) {
    nameParts.splice(nameParts.length - 1, 0, `carrierSettings${carrier ? `.${carrier}` : ''}`);
  }

  return nameParts.join('.');
};
