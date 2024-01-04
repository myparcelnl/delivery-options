import {type DeepReadonly} from 'vue';
import {type CarrierIdentifier, type CarrierWithIdentifier, type UnionExcept} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type DeliveryOption, type PickupLocation} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: CarrierWithIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: string;
}

export interface ResolvedPickupLocation extends PickupLocation {
  carrier: CarrierIdentifier;
}

export interface SelectedDeliveryMoment
  extends Replace<
    Omit<ResolvedDeliveryOptions, 'carrier'>,
    'deliveryType',
    UnionExcept<DeliveryTypeName, DeliveryTypeName.Pickup>
  > {
  carrier: CarrierIdentifier;
}
