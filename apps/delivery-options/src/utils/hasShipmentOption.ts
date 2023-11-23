import {type CarrierIdentifier} from '@myparcel-do/shared';
import {type ShipmentOptionName} from '@myparcel/constants';
import {getShipmentOptionConfigMap} from './getShipmentOptionConfigMap';
import {getResolvedValue} from './getResolvedValue';

export const hasShipmentOption = (name: ShipmentOptionName, carrier?: CarrierIdentifier): boolean => {
  // @ts-expect-error todo
  const key = getShipmentOptionConfigMap()[name] ?? null;

  if (!key) {
    return false;
  }

  return getResolvedValue(key, carrier);
};
