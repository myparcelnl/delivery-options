import {DeliveryTypeName, PackageTypeName, PlatformName, ShipmentOptionName} from '@myparcel-dev/constants';
import {type DropOffEntryObject} from '../types';
import {CarrierSetting} from './enums';

export const SUPPORTED_PLATFORMS = Object.freeze([PlatformName.MyParcel, PlatformName.SendMyParcel]);

export const SUPPORTED_DELIVERY_TYPES = Object.freeze([
  DeliveryTypeName.Standard,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Morning,
  DeliveryTypeName.Pickup,
]);

export const SUPPORTED_SHIPMENT_OPTIONS = Object.freeze([
  ShipmentOptionName.OnlyRecipient,
  ShipmentOptionName.Signature,
  ShipmentOptionName.PriorityDelivery,
]);

export const SUPPORTED_PACKAGE_TYPES = Object.freeze([
  PackageTypeName.Package,
  PackageTypeName.Mailbox,
  PackageTypeName.DigitalStamp,
  PackageTypeName.PackageSmall,
]);

export const DEFAULT_PLATFORM = PlatformName.MyParcel;

export const FORM_NAME_DELIVERY_OPTIONS = 'deliveryOptions';

export const REQUEST_KEY_CARRIERS = 'carriers';

export const REQUEST_KEY_DELIVERY_OPTIONS = 'deliveryOptions';

export const REQUEST_KEY_PICKUP_LOCATIONS = 'pickupLocations';

export const DROP_OFF_WEEKDAY = 'weekday' satisfies keyof DropOffEntryObject;

export const DROP_OFF_CUTOFF_TIME = CarrierSetting.CutoffTime satisfies keyof DropOffEntryObject;

export const DROP_OFF_SAME_DAY_CUTOFF_TIME = CarrierSetting.CutoffTimeSameDay satisfies keyof DropOffEntryObject;

export const DAY_MONDAY = 1;

export const DAY_TUESDAY = 2;

export const DAY_WEDNESDAY = 3;

export const DAY_THURSDAY = 4;

export const DAY_FRIDAY = 5;

export const DAY_SATURDAY = 6;

export const DAY_SUNDAY = 0;

export const DAYS_IN_WEEK = 7;

export const NBSP = '\u00A0';

export const CARRIER_IDENTIFIER_SEPARATOR = ':';

export const API_DATE_FORMAT = 'y-MM-dd kk:mm:ss';

export const DEFAULT_TIMEZONE_TYPE = 3;

export const DEFAULT_TIMEZONE = 'Europe/Amsterdam';

export const DELIVERY_TIMEFRAME_TYPE_START = 'start';

export const DELIVERY_TIMEFRAME_TYPE_END = 'end';
