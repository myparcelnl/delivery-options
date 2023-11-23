import {type CarrierIdentifier} from '@myparcel-do/shared';
import {type ShipmentOptionName} from '@myparcel/constants';
import {SHIPMENT_OPTION_CONFIG_MAP} from '../constants';
import {getResolvedValue} from './getResolvedValue';

export const hasShipmentOption = (name: ShipmentOptionName, carrier?: CarrierIdentifier): boolean => {
  // @ts-expect-error todo
  const key = SHIPMENT_OPTION_CONFIG_MAP[name] ?? null;

  if (!key) {
    return false;
  }

  return getResolvedValue(key, carrier);
};
