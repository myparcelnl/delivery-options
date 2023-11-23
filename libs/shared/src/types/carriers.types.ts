import {type Carrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from './config.types';

export interface CarrierObject {
  identifier: CarrierIdentifier;
  name: CarrierName;
}

export interface CarrierWithIdentifier extends Carrier {
  identifier: CarrierIdentifier;
}
