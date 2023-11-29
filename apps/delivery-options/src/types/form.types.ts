import {type DeepReadonly} from 'vue';
import {type CarrierIdentifier, type CarrierWithIdentifier} from '@myparcel-do/shared';
import {type DeliveryOption} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: CarrierWithIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: string;
}

export interface SelectedDeliveryMoment extends Omit<ResolvedDeliveryOptions, 'carrier'> {
  carrier: CarrierIdentifier;
}
