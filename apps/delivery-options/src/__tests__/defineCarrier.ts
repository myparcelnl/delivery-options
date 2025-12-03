import {type CarrierWithIdentifier} from '@myparcel-dev/shared';
import {isOfType} from '@myparcel-dev/ts-utils';
import {type Carrier} from '@myparcel-dev/sdk';

export const defineCarrier = (carrier: Carrier | CarrierWithIdentifier): CarrierWithIdentifier => ({
  ...carrier,
  identifier: isOfType<CarrierWithIdentifier>(carrier, 'identifier') ? carrier.identifier : carrier.name,
});
