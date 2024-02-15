import {isEnumValue} from '@myparcel/ts-utils';
import {DeliveryTypeName, ShipmentOptionName, PackageTypeName} from '@myparcel/constants';
import {
  type ConfigKey,
  CustomDeliveryType,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  type SupportedPackageTypeName,
} from '../types';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getDeliveryTypeConfigMap, getPackageTypeConfigMap} from './getDeliveryTypeConfigMap';

export const getConfigKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName | SupportedPackageTypeName,
): ConfigKey => {
  let map: Record<string, string> | undefined = undefined;

  if (isEnumValue(input, PackageTypeName)) {
    map = getPackageTypeConfigMap();
  }

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
