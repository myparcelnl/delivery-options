import {type DeepReadonly} from 'vue';
import {
  type CarrierIdentifier,
  type OutputPickupLocation,
  type SupportedDeliveryTypeName,
  type AnyTranslatable,
  type DeliveryDeliveryType,
} from '@myparcel-do/shared';
import {type Replace} from '@myparcel/ts-utils';
import {type DeliveryOption, type StartEndDate} from '@myparcel/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel/constants';

export interface ResolvedDeliveryOptions {
  carrier: CarrierIdentifier;
  date: undefined | string;
  deliveryType: DeliveryTypeName;
  packageType: PackageTypeName;
  shipmentOptions: DeepReadonly<DeliveryOption['possibilities'][number]['shipment_options']>;
  time: AnyTranslatable;
}

export interface OpeningHoursEntry {
  hours: StartEndDate[];
  weekday: number;
}

export interface ResolvedPickupLocation extends OutputPickupLocation {
  carrier: CarrierIdentifier;
  openingHours: OpeningHoursEntry[];
}

export interface SelectedDeliveryMoment<T extends SupportedDeliveryTypeName = SupportedDeliveryTypeName>
  extends Replace<Omit<ResolvedDeliveryOptions, 'carrier'>, 'deliveryType', T> {
  carrier: CarrierIdentifier;
}

export type SelectedDeliveryMomentDelivery = SelectedDeliveryMoment<DeliveryDeliveryType>;

export type SelectedDeliveryMomentPickup = SelectedDeliveryMoment<DeliveryTypeName.Pickup>;
