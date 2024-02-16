import {
  type CarrierIdentifier,
  type SupportedDeliveryTypeName,
  PACKAGE_TYPE_DEFAULT,
  getPackageTypePriceKey,
} from '@myparcel-do/shared';
import {useConfigStore} from '../stores';
import {getResolvedValue} from './getResolvedValue';
import {getConfigPriceKey} from './getConfigPriceKey';

export const getDeliveryTypePrice = (deliveryType: SupportedDeliveryTypeName, carrier?: CarrierIdentifier): number => {
  const config = useConfigStore();

  const priceKey =
    PACKAGE_TYPE_DEFAULT === config.packageType
      ? getConfigPriceKey(deliveryType)
      : getPackageTypePriceKey(config.packageType);

  return getResolvedValue(priceKey, carrier) ?? 0;
};
