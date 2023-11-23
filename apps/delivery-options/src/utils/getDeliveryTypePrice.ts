import {type CarrierIdentifier} from '@myparcel-do/shared';
import {type ResolvedDeliveryOptions} from '../types';
import {getResolvedValue} from './getResolvedValue';
import {getConfigPriceKey} from './getConfigPriceKey';

export const getDeliveryTypePrice = (option: ResolvedDeliveryOptions, carrier?: CarrierIdentifier): number => {
  const priceKey = getConfigPriceKey(option.deliveryType);

  return getResolvedValue(priceKey, carrier) ?? 0;
};
