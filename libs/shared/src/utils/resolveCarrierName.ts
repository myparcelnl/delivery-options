import {type CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from '../types';

const CARRIER_IDENTIFIER_SEPARATOR = ':';

export const resolveCarrierName = (carrierName: CarrierIdentifier): CarrierName => {
  if (carrierName.includes(CARRIER_IDENTIFIER_SEPARATOR)) {
    return carrierName.split(CARRIER_IDENTIFIER_SEPARATOR)[0];
  }

  return carrierName;
};
