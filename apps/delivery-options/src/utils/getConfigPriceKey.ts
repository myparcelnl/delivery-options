import {
  type CarrierSetting,
  getAllConfigOptions,
  RelatedConfigOptionType,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {getConfigKey} from './getConfigKey';

type CarrierSettingPriceKey = Extract<CarrierSetting, `price${string}`>;

export const getConfigPriceKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName,
): CarrierSettingPriceKey => {
  const key = getConfigKey(input);
  const options = getAllConfigOptions();

  const match = options.find((option) => option.key === key);
  const relatedPrice = match?.related?.find((related) => related.type === RelatedConfigOptionType.Price);

  if (!relatedPrice) {
    throw new Error(`No price found for option: ${input}`);
  }

  return relatedPrice.key as CarrierSettingPriceKey;
};
