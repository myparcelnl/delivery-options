import {type Carrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from './platform.types';
import {type CarrierIdentifier, type ConfigKey} from './config.types';

export interface CarrierObject {
  identifier: CarrierIdentifier;
  name: CarrierName;
}

export interface CarrierWithIdentifier extends Carrier {
  identifier: CarrierIdentifier;
}

export type FullCarrier = CarrierWithIdentifier & {
  hasDeliveryInCountry(countryCode: string): boolean;
  hasDeliveryType(deliveryType: SupportedDeliveryTypeName): boolean;
  hasFeature(feature: ConfigKey): boolean;
  hasPackageType(packageType: SupportedPackageTypeName): boolean;
  hasPickupInCountry(countryCode: string): boolean;
  hasShipmentOption(shipmentOption: SupportedShipmentOptionName): boolean;
};
