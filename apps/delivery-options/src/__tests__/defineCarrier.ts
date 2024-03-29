import {type CarrierWithIdentifier} from '@myparcel-do/shared';
import {isOfType} from '@myparcel/ts-utils';
import {type Carrier} from '@myparcel/sdk';

export const defineCarrier = (carrier: Carrier | CarrierWithIdentifier): CarrierWithIdentifier => ({
  ...carrier,
  identifier: isOfType<CarrierWithIdentifier>(carrier, 'identifier') ? carrier.identifier : carrier.name,
});
