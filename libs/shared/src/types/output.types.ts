import type {SHIPMENT_OPTION_MAP} from '../utils';
import {type Replace} from '@myparcel-dev/ts-utils';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel-dev/constants';
import {type PickupLocationType} from '../data';
// Import directly from module to avoid circular dependency through barrel.
import {type CarrierIdentifier} from './config.types';

type SnakeToCamel<S extends string> = S extends `${infer P}_${infer R}` ? `${P}${Capitalize<SnakeToCamel<R>>}` : S;

type ShipmentOptionsOutput = {
  [K in (typeof SHIPMENT_OPTION_MAP)[keyof typeof SHIPMENT_OPTION_MAP] as SnakeToCamel<K>]?: boolean;
};

interface BaseOutput {
  carrier: CarrierIdentifier;
  date?: string;
  deliveryType: DeliveryTypeName;
  isPickup: boolean;
  packageType: PackageTypeName;
  shipmentOptions: ShipmentOptionsOutput;
}

export type DeliveryDeliveryType = DeliveryTypeName.Standard | DeliveryTypeName.Evening | DeliveryTypeName.Morning;

export interface DeliveryOutput extends BaseOutput {
  deliveryType: DeliveryDeliveryType;
  isPickup: false;
}

export interface OutputPickupLocation {
  cc: string;
  city: string;
  /** @since v6.0.0 */
  distance: number;
  latitude: number;
  locationCode: string;
  locationName: string;
  longitude: number;
  number: string;
  numberSuffix: string;
  postalCode: string;
  retailNetworkId: string;
  street: string;
  /** @since v6.0.0 */
  type: PickupLocationType;
}

export interface PickupOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Pickup;
  isPickup: true;
  pickupLocation: OutputPickupLocation;
}

export type DeliveryOptionsOutput = DeliveryOutput | PickupOutput;

export type InternalOutput = {
  homeOrPickup: string;
  deliveryDate: null | string;

  /**
   * JSON encoded SelectedDeliveryMoment
   * @see SelectedDeliveryMoment
   */
  deliveryMoment: string;
  shipmentOptions?: ShipmentOptionName[];

  /**
   * Location code.
   */
  pickupLocation?: string;
};

export type InternalOutputWithPickupLocation = Replace<InternalOutput, 'pickupLocation', Record<string, unknown>>;
