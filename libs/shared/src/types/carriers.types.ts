import {type CarrierName} from '@myparcel/constants';
import {type CarrierIdentifier} from './config.types';

export interface CarrierObject {
  identifier: CarrierIdentifier;
  name: CarrierName;
}
