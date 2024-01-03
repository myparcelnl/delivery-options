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
  locationName: string;
  locationCode: string;
  retailNetworkId: string;
  /** @since v6.0.0 */
  type: PickupLocationType;

  street: string;
  number: string;
  numberSuffix: string;
  postalCode: string;
  city: string;
  cc: string;

  /** @deprecated use numberSuffix */
  number_suffix?: string;
  /** @deprecated use postalCode */
  postal_code?: string;
  /** @deprecated use locationName */
  location_name?: string;
  /** @deprecated use locationCode */
  location_code?: string;
  /** @deprecated use retailNetworkId */
  retail_network_id?: string;
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
   * JSON encoded ResolvedPickupLocation
   */
  pickupLocation?: string;
};
