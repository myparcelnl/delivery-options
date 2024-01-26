import {isEnumValue} from '@myparcel/ts-utils';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {
  type ConfigKey,
  CustomDeliveryType,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from '../types';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getPackageTypeConfigMap} from './getPackageTypeConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';

export const getConfigKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName | SupportedPackageTypeName | CustomDeliveryType,
): ConfigKey | null => {
  let key: string | null = null;

  if (isEnumValue(input, PackageTypeName)) {
    const map = getPackageTypeConfigMap();

    key = map[input] ?? null;
  }

  if (isEnumValue(input, DeliveryTypeName) || isEnumValue(input, CustomDeliveryType)) {
    const map = getDeliveryTypeConfigMap();

    key = map[input] ?? null;
  }

  if (isEnumValue(input, ShipmentOptionName)) {
    const map = getShipmentOptionConfigMap();

    key = map[input] ?? null;
  }

  return key as ConfigKey | null;
};
