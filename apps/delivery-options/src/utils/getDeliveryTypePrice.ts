import {type CarrierIdentifier, type SupportedDeliveryTypeName} from '@myparcel-do/shared';
import {getResolvedValue} from './getResolvedValue';
import {getConfigPriceKey} from './getConfigPriceKey';

export const getDeliveryTypePrice = (deliveryType: SupportedDeliveryTypeName, carrier?: CarrierIdentifier): number => {
  const priceKey = getConfigPriceKey(deliveryType);

  return getResolvedValue(priceKey, carrier) ?? 0;
};
