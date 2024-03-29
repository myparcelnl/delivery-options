import {type CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from '../types';
import {CARRIER_IDENTIFIER_SEPARATOR} from '../data';

export const splitCarrierIdentifier = (carrierIdentifier: CarrierIdentifier): [CarrierName, string | undefined] => {
  const [carrierName, subscriptionId] = carrierIdentifier.split(CARRIER_IDENTIFIER_SEPARATOR);

  return [carrierName as CarrierName, subscriptionId];
};
