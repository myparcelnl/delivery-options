import {type DeepReadonly} from 'vue';
import {
  type CarrierIdentifier,
  type OutputPickupLocation,
  type SupportedDeliveryTypeName,
  type AnyTranslatable,
  type DeliveryDeliveryType,
} from '@myparcel-dev/do-shared';
import {type Replace} from '@myparcel-dev/ts-utils';
import {type DeliveryOption, type StartEndDate} from '@myparcel-dev/sdk';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel-dev/constants';

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
