import {type CarrierName, type PlatformName} from '@myparcel/constants';
import {type SubscriptionType} from '../constants';

export type SupportedPlatformName = PlatformName.MyParcel | PlatformName.SendMyParcel;

export type SubscriptionId = string | undefined;

export interface CarrierOptions {
  deliveryCountries?: string[];
  deliveryTypes?: string[];
  features?: string[];
  name: CarrierName;
  packageTypes?: string[];
  pickupCountries?: string[];
  shipmentOptions?: string[];
  subscription: SubscriptionType;
}

export interface PlatformOptions {
  carriers: CarrierOptions[];
  features?: string[];
}
