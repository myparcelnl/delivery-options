import {type Carrier} from '@myparcel/sdk';
import {
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from './platform.types';
import {type CarrierIdentifier, type ConfigKey} from './config.types';

export interface CarrierWithIdentifier extends Carrier {
  identifier: CarrierIdentifier;
}

export type FullCarrier = CarrierWithIdentifier & {
  allOptions: string[];
  hasDeliveryInCountry(countryCode: string): boolean;
  hasDeliveryType(deliveryType: SupportedDeliveryTypeName): boolean;
  hasFeature(feature: ConfigKey): boolean;
  hasPackageType(packageType: SupportedPackageTypeName): boolean;
  hasPickupInCountry(countryCode: string): boolean;
  hasShipmentOption(shipmentOption: SupportedShipmentOptionName): boolean;
};
