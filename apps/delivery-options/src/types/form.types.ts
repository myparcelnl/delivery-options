import {type DeepReadonly} from 'vue';
import {type CarrierIdentifier, type OutputPickupLocation, type UnionExcept} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type DeliveryOption, type StartEndDate} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: CarrierIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: string;
}

export interface OpeningHoursEntry {
  hours: StartEndDate[];
  weekday: number;
}

export interface ResolvedPickupLocation extends OutputPickupLocation {
  carrier: CarrierIdentifier;
  openingHours: OpeningHoursEntry[];
}

export interface SelectedDeliveryMoment
  extends Replace<
    Omit<ResolvedDeliveryOptions, 'carrier'>,
    'deliveryType',
    UnionExcept<DeliveryTypeName, DeliveryTypeName.Pickup>
  > {
  carrier: CarrierIdentifier;
}
