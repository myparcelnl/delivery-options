import {type CarrierName, type PlatformName} from '@myparcel/constants';
import {type SubscriptionType} from '../constants';

export type SupportedPlatformName = PlatformName.MyParcel | PlatformName.SendMyParcel;

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
