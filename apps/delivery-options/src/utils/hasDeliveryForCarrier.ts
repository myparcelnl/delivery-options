import {type CarrierCapability, type CarrierIdentifier, CarrierSetting, getConfigKey} from '@myparcel-dev/do-shared';
import {DELIVERY_TYPES} from '../data';
import {getResolvedValue} from './getResolvedValue';
import {getCapabilityDeliveryTypes} from './getCapabilityDeliveryTypes';

export const hasDeliveryForCarrier = (cap: CarrierCapability, carrierIdentifier?: CarrierIdentifier): boolean => {
  if (!getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier)) {
    return false;
  }

  const capDeliveryTypes = getCapabilityDeliveryTypes(cap);

  return DELIVERY_TYPES.some((deliveryType) => {
    const configKey = getConfigKey(deliveryType);

    return getResolvedValue(configKey, carrierIdentifier) && capDeliveryTypes.includes(deliveryType);
  });
};
