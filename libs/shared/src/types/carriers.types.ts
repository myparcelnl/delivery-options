import {type Carrier} from '@myparcel-dev/sdk';
import {type CarrierIdentifier} from './config.types';

export interface CarrierWithIdentifier extends Carrier {
  identifier: CarrierIdentifier;
}
