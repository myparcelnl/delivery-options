import {type DeepReadonly} from 'vue';
import {type Replace} from '@myparcel-dev/ts-utils';
import {type DeliveryOption, type StartEndDate} from '@myparcel-dev/sdk';
import {
  type CarrierIdentifier,
  type OutputPickupLocation,
  type SupportedDeliveryTypeName,
  type AnyTranslatable,
  type DeliveryDeliveryType,
} from '@myparcel-dev/do-shared';
import {type DeliveryTypeName, type PackageTypeName} from '@myparcel-dev/constants';

export interface ResolvedDeliveryOptions {
  carrier: CarrierIdentifier;
  date: undefined | string;
  deliveryType: DeliveryTypeName;
  /**
   * The delivery type as returned by the API, before being resolved to a custom
   * type (e.g. an evening moment dated today resolves to same_day). Internal
   * tracking only: used to emit the actual delivery type for carriers exposing
   * same-day as a shipment option. Never part of the external output.
   */
  originalDeliveryType?: DeliveryTypeName;
  /**
   * True for moments the widget synthesized itself (e.g. the same-day today
   * moment for carriers the legacy delivery options API does not support).
   * Synthetic moments do not count as real API data when deciding fallback
   * eligibility. Never part of the external output.
   */
  isSynthetic?: boolean;
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
