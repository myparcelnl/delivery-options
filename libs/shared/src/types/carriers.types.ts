import {type Carrier} from '@myparcel/sdk';
import {type CarrierName} from '@myparcel/constants';
import {type CarrierSetting, type ConfigSetting} from '../enums';
import {
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from './platform.types';
import {type CarrierIdentifier} from './config.types';

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
  hasFeature(feature: CarrierSetting | ConfigSetting): boolean;
  hasPackageType(packageType: SupportedPackageTypeName): boolean;
  hasPickupInCountry(countryCode: string): boolean;
  hasShipmentOption(shipmentOption: SupportedShipmentOptionName): boolean;
};
