import {isEnumValue} from '@myparcel/ts-utils';
import {CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from '../types';

const CARRIER_IDENTIFIER_SEPARATOR = ':';

export const resolveCarrierName = (carrierName: CarrierIdentifier): CarrierName => {
  if (isEnumValue(carrierName, CarrierName)) {
    return carrierName;
  }

  return carrierName.split(CARRIER_IDENTIFIER_SEPARATOR)[0] as CarrierName;
};
