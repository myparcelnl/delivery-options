import {type Carrier} from '@myparcel/sdk';
import {type CarrierIdentifier} from './config.types';

export interface CarrierWithIdentifier extends Carrier {
  identifier: CarrierIdentifier;
}
