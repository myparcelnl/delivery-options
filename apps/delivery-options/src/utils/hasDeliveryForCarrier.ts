import {type CarrierCapability, type CarrierIdentifier, getConfigKey} from '@myparcel-dev/do-shared';
import {DELIVERY_TYPES} from '../data';
import {getResolvedValue} from './getResolvedValue';
import {getCapabilityDeliveryTypes} from './getCapabilityDeliveryTypes';

export const hasDeliveryForCarrier = (cap: CarrierCapability, carrierIdentifier?: CarrierIdentifier): boolean => {
  const capDeliveryTypes = getCapabilityDeliveryTypes(cap);

  return DELIVERY_TYPES.some((deliveryType) => {
    const configKey = getConfigKey(deliveryType);

    return getResolvedValue(configKey, carrierIdentifier) && capDeliveryTypes.includes(deliveryType);
  });
};
