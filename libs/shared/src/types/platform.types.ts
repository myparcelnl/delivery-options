import {type CarrierName} from '@myparcel/constants';
import {type SubscriptionType} from '../enums';
import {
  type SUPPORTED_DELIVERY_TYPES,
  type SUPPORTED_PACKAGE_TYPES,
  type SUPPORTED_PLATFORMS,
  type SUPPORTED_SHIPMENT_OPTIONS,
} from '../constants';
import {type ConfigKey} from './config.types';

export type SupportedPlatformName = (typeof SUPPORTED_PLATFORMS)[number];

export enum CustomDeliveryType {
  SameDay = 'same_day',
}

export type SupportedDeliveryTypeName = (typeof SUPPORTED_DELIVERY_TYPES)[number] | CustomDeliveryType;

export type SupportedShipmentOptionName = (typeof SUPPORTED_SHIPMENT_OPTIONS)[number];

export type SupportedPackageTypeName = (typeof SUPPORTED_PACKAGE_TYPES)[number];

export type SubscriptionId = string | undefined;

export type ConfigPriceKey = Extract<ConfigKey, `price${string}`>;

export interface CarrierOptions {
  addressFields?: string[];
  deliveryCountries?: string[];
  deliveryTypes: SupportedDeliveryTypeName[];
  /**
   * Enable to use empty delivery options (without fetching) for this carrier in all countries that are not in
   * getCountriesForDelivery.
   */
  fakeDelivery?: boolean;
  features?: ConfigKey[];
  name: CarrierName;
  packageTypes: SupportedPackageTypeName[];
  pickupCountries?: string[];
  shipmentOptions?: SupportedShipmentOptionName[];
  subscription: SubscriptionType;
}

export interface PlatformOptions {
  carriers: CarrierOptions[];
  features?: string[];
}
