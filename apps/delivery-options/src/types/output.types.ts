import {type CarrierIdentifier} from '@myparcel-do/shared';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';

interface ShipmentOptionsOutput {
  onlyRecipient?: boolean;
  signature?: boolean;
}

interface BaseOutput {
  carrier: CarrierIdentifier;
  date: string;
  deliveryType: DeliveryTypeName;
  isPickup: boolean;
  packageType: PackageTypeName;
  shipmentOptions: ShipmentOptionsOutput;
}

interface DeliveryOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Standard | DeliveryTypeName.Evening | DeliveryTypeName.Morning;
  isPickup: false;
}

interface PickupOutput extends BaseOutput {
  deliveryType: DeliveryTypeName.Pickup;
  isPickup: true;
  pickupLocation: {
    location: {
      latitude: number;
      longitude: number;
    };
    name: string;
    openingHours: string;
    pickupLocationCode: string;
    street: string;
    streetAdditionalInfo: string;
    city: string;
    postalCode: string;
  };
}

export type DeliveryOptionsOutput = DeliveryOutput | PickupOutput;

export type InternalOutput = {
  deliveryDate: string;
  /**
   * JSON encoded SelectedDeliveryMoment
   * @see SelectedDeliveryMoment
   */
  deliveryMoment: string;
  shipmentOptions?: ShipmentOptionName[];
};
