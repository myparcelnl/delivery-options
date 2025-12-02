import {isEnumValue} from '@myparcel-dev/ts-utils';
import {CarrierName} from '@myparcel-dev/constants';
import {type CarrierIdentifier} from '../types';
import {splitCarrierIdentifier} from './splitCarrierIdentifier';

export const resolveCarrierName = (carrierIdentifier: CarrierIdentifier): CarrierName => {
  if (isEnumValue(carrierIdentifier, CarrierName)) {
    return carrierIdentifier;
  }

  return splitCarrierIdentifier(carrierIdentifier)[0];
};
