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
