import {DeliveryTypeName, PackageTypeName, PlatformName, ShipmentOptionName} from '@myparcel/constants';
import {type DropOffEntry} from './types';

export const SUPPORTED_PLATFORMS = [PlatformName.MyParcel, PlatformName.SendMyParcel] as const;

export const SUPPORTED_DELIVERY_TYPES = [
  DeliveryTypeName.Standard,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Morning,
  DeliveryTypeName.Pickup,
] as const;

export const SUPPORTED_SHIPMENT_OPTIONS = [ShipmentOptionName.OnlyRecipient, ShipmentOptionName.Signature] as const;

export const SUPPORTED_PACKAGE_TYPES = [
  PackageTypeName.Package,
  PackageTypeName.Mailbox,
  PackageTypeName.DigitalStamp,
] as const;

export const DEFAULT_PLATFORM = PlatformName.MyParcel;

export const FORM_NAME_DELIVERY_OPTIONS = 'deliveryOptions';

export const REQUEST_KEY_CARRIERS = 'carriers';

export const REQUEST_KEY_DELIVERY_OPTIONS = 'deliveryOptions';

export const REQUEST_KEY_PICKUP_LOCATIONS = 'pickupLocations';

export const DROP_OFF_DAY = 'day' satisfies keyof DropOffEntry;

export const DROP_OFF_CUTOFF_TIME = 'cutoffTime' satisfies keyof DropOffEntry;

export const DROP_OFF_SAME_DAY_CUTOFF_TIME = 'sameDayCutoffTime' satisfies keyof DropOffEntry;
