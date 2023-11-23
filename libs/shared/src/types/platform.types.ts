import {type CarrierName} from '@myparcel/constants';
import {type SubscriptionType} from '../enums';
import {
  type SUPPORTED_DELIVERY_TYPES,
  type SUPPORTED_PACKAGE_TYPES,
  type SUPPORTED_PLATFORMS,
  type SUPPORTED_SHIPMENT_OPTIONS,
} from '../constants';

export type SupportedPlatformName = (typeof SUPPORTED_PLATFORMS)[number];

export type SupportedDeliveryTypeName = (typeof SUPPORTED_DELIVERY_TYPES)[number];

export type SupportedShipmentOptionName = (typeof SUPPORTED_SHIPMENT_OPTIONS)[number];

export type SupportedPackageTypeName = (typeof SUPPORTED_PACKAGE_TYPES)[number];

export type SubscriptionId = string | undefined;

export interface CarrierOptions {
  addressFields?: string[];
  deliveryCountries?: string[];
  deliveryTypes: string[];
  /**
   * Enable to use empty delivery options (without fetching) for this carrier in all countries that are not in
   * getCountriesForDelivery.
   */
  fakeDelivery?: boolean;
  features?: string[][];
  name: CarrierName;
  packageTypes: string[];
  pickupCountries?: string[];
  shipmentOptions?: string[];
  subscription: SubscriptionType;
}

export interface PlatformOptions {
  carriers: CarrierOptions[];
  features?: string[];
}
