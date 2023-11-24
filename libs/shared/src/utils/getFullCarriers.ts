import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';
import {type CarrierIdentifier, type CarrierOptions, type CarrierWithIdentifier} from '../types';
import {useCurrentPlatform} from '../composables';
import {getFullCarrier} from './getFullCarrier';

export type FullCarrier = CarrierWithIdentifier &
  CarrierOptions & {
    hasDeliveryInCountry(countryCode?: string): boolean;
    hasDeliveryType(deliveryType: DeliveryTypeName): boolean;
    hasFeature(feature: string): boolean;
    hasPackageType(packageType: PackageTypeName): boolean;
    hasPickupInCountry(countryCode?: string): boolean;
    hasShipmentOption(shipmentOption: ShipmentOptionName): boolean;
  };

export const getFullCarriers = (carriers: CarrierIdentifier[]): Promise<FullCarrier[]> => {
  const platform = useCurrentPlatform();

  return Promise.all(carriers.map((carrier) => getFullCarrier(carrier, platform.name.value)));
};
