import {
  type SUPPORTED_DELIVERY_TYPES,
  type SUPPORTED_PACKAGE_TYPES,
  type SUPPORTED_PLATFORMS,
  type SUPPORTED_SHIPMENT_OPTIONS,
  type CustomDeliveryType,
} from '../data';
import {type ConfigKey} from './config.types';

export type SupportedPlatformName = (typeof SUPPORTED_PLATFORMS)[number];

export type SupportedDeliveryTypeName = (typeof SUPPORTED_DELIVERY_TYPES)[number] | CustomDeliveryType;

export type SupportedShipmentOptionName = (typeof SUPPORTED_SHIPMENT_OPTIONS)[number];

export type SupportedPackageTypeName = (typeof SUPPORTED_PACKAGE_TYPES)[number];

export type ConfigPriceKey = Extract<ConfigKey, `price${string}`>;
