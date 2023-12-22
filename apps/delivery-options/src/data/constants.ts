import {ShipmentOptionName} from '@myparcel/constants';

export const FIELD_HOME_OR_PICKUP = 'homeOrPickup';

export const HOME_OR_PICKUP_HOME = 'home';

export const FIELD_DELIVERY_MOMENT = 'deliveryMoment';

export const FIELD_DELIVERY_DATE = 'deliveryDate';

export const FIELD_SHIPMENT_OPTIONS = 'shipmentOptions';

export const HOME_OR_PICKUP_PICKUP = 'pickup';

export const FIELD_PICKUP_LOCATION = 'pickupLocation';

export const SHOWN_SHIPMENT_OPTIONS = [ShipmentOptionName.Signature, ShipmentOptionName.OnlyRecipient] as const;
