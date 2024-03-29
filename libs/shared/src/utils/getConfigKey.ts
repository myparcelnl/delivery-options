import {isEnumValue} from '@myparcel/ts-utils';
import {DeliveryTypeName, ShipmentOptionName} from '@myparcel/constants';
import {type ConfigKey, type SupportedDeliveryTypeName, type SupportedShipmentOptionName} from '../types';
import {CustomDeliveryType} from '../data';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';

export const getConfigKey = (input: SupportedDeliveryTypeName | SupportedShipmentOptionName): ConfigKey => {
  let map: Record<string, string> | undefined = undefined;

  if (isEnumValue(input, {...DeliveryTypeName, ...CustomDeliveryType})) {
    map = getDeliveryTypeConfigMap();
  }

  if (isEnumValue(input, ShipmentOptionName)) {
    map = getShipmentOptionConfigMap();
  }

  if (!map) {
    throw new Error(`No config key found for ${input}`);
  }

  return map[input] as ConfigKey;
};
