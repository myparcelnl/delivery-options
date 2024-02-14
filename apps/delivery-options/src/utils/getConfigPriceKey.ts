import {
  type ConfigPriceKey,
  getAllConfigOptions,
  getConfigKey,
  RelatedConfigOptionType,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  type SupportedPackageTypeName,
} from '@myparcel-do/shared';

export const getConfigPriceKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName | SupportedPackageTypeName,
): ConfigPriceKey => {
  const key = getConfigKey(input);
  const options = getAllConfigOptions();

  const match = options.find((option) => option.key === key);
  const relatedPrice = match?.related?.find((related) => related.type === RelatedConfigOptionType.Price);

  if (!relatedPrice) {
    throw new Error(`No price found for option: ${input}`);
  }

  return relatedPrice.key as ConfigPriceKey;
};
