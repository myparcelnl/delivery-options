import {
  type CarrierSettings,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {isEnumValue} from '@myparcel/ts-utils';
import {DeliveryTypeName, PackageTypeName, ShipmentOptionName} from '@myparcel/constants';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getPackageTypeConfigMap} from './getPackageTypeConfigMap';
import {getDeliveryTypeConfigMap} from './getDeliveryTypeConfigMap';

export const getConfigKey = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName | SupportedPackageTypeName,
): keyof CarrierSettings | null => {
  let key: string | null = null;

  if (isEnumValue(input, PackageTypeName)) {
    const map = getPackageTypeConfigMap();

    key = map[input] ?? null;
  }

  if (isEnumValue(input, DeliveryTypeName)) {
    const map = getDeliveryTypeConfigMap();

    key = map[input] ?? null;
  }

  if (isEnumValue(input, ShipmentOptionName)) {
    const map = getShipmentOptionConfigMap();

    key = map[input] ?? null;
  }

  return key as keyof CarrierSettings | null;
};
