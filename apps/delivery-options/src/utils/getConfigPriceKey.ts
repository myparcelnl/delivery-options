import {
  type CarrierSettings,
  getAllOptions,
  RelatedConfigOptionType,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {isEnumValue} from '@myparcel/ts-utils';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel/constants';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';

type CarrierSettingPriceKey = Extract<keyof CarrierSettings, `price${string}`>;

export const getConfigPriceKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName,
): CarrierSettingPriceKey => {
  const options = getAllOptions();

  let key: string | null = null;

  if (isEnumValue(input, DeliveryTypeName)) {
    const map = getDeliveryTypeConfigMap();

    key = map[input] ?? null;
  }

  if (isEnumValue(input, ShipmentOptionName)) {
    const map = getShipmentOptionConfigMap();

    key = map[input] ?? null;
  }

  const match = options.find((option) => option.key === key);
  const relatedPrice = match?.related?.find((related) => related.type === RelatedConfigOptionType.Price);

  if (!relatedPrice) {
    throw new Error(`No price found for option: ${input}`);
  }

  return relatedPrice.key as CarrierSettingPriceKey;
};
