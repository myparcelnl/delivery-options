import {type DeliveryOptionsParameters} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {
  type SubscriptionType,
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

export interface CarrierConfiguration {
  addressFields?: string[];
  deliveryCountries?: string[];
  deliveryTypes: SupportedDeliveryTypeName[];

  /**
   * Enable to use empty delivery options (without fetching) for this carrier in all countries that are not in
   * getCountriesForDelivery.
   */
  fakeDelivery?: boolean;

  /**
   * Countries to NOT use fake delivery for if fakeDelivery is enabled.
   */
  fakeDeliveryBlacklist?: string[];
  features?: ConfigKey[];
  name: CarrierName;
  packageTypes: SupportedPackageTypeName[];
  pickupCountries?: string[];
  shipmentOptions?: SupportedShipmentOptionName[];
  subscription: SubscriptionType;
  /**
   * Parameters that are not supported by the carrier and should be removed from the request.
   */
  unsupportedParameters?: (keyof DeliveryOptionsParameters | string)[];
}

export interface PlatformConfiguration {
  carriers: CarrierConfiguration[];
}
