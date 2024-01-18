import {type Replace} from '@myparcel/ts-utils';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';
import {type PickupLocationType} from '../data';
import {type CarrierIdentifier} from './config.types';

interface ShipmentOptionsOutput {
  onlyRecipient?: boolean;
  signature?: boolean;
}

interface BaseOutput {
  carrier: CarrierIdentifier;
  date?: string;
  deliveryType: DeliveryTypeName;
  isPickup: boolean;
  packageType: PackageTypeName;
  shipmentOptions: ShipmentOptionsOutput;
}

export interface DeliveryOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Standard | DeliveryTypeName.Evening | DeliveryTypeName.Morning;
  isPickup: false;
}

export type OutputPickupLocation = {
  /** @since v6.0.0 */
  type: PickupLocationType;

  locationName: string;
  locationCode: string;
  retailNetworkId: string;

  latitude: number;
  longitude: number;
  street: string;
  number: string;
  numberSuffix: string;
  postalCode: string;
  city: string;
  cc: string;
};

export interface PickupOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Pickup;
  isPickup: true;
  pickupLocation: OutputPickupLocation;
}

export type DeliveryOptionsOutput = DeliveryOutput | PickupOutput;

export type InternalOutput = {
  homeOrPickup: string;
  deliveryDate: string;

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

export type InternalOutputWithPickupLocation = Replace<InternalOutput, 'pickupLocation', {}>;
