import {useMemoize} from '@vueuse/core';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';
import {getPlatformConfig, resolveCarrierName} from '../utils';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {useCarrier} from '../sdk';

const getCarrierConfiguration = useMemoize((carrierIdentifier: CarrierIdentifier, platform?: SupportedPlatformName) => {
  const platformConfig = getPlatformConfig(platform);
  const carrierName = resolveCarrierName(carrierIdentifier);

  const foundCarrier = platformConfig?.carriers.find((carrier) => carrier.name === carrierName);

  if (!foundCarrier) {
    throw new Error(`No configuration found for carrier ${carrierIdentifier}`);
  }

  return foundCarrier;
});

export interface UseCarrierConfiguration {
  carrier: ReturnType<typeof useCarrier>;
  config: ReturnType<typeof getCarrierConfiguration>;

  hasDeliveryType(deliveryType: DeliveryTypeName): boolean;

  hasFeature(feature: string): boolean;

  hasPackageType(packageType: PackageTypeName): boolean;

  hasShipmentOption(shipmentOption: ShipmentOptionName): boolean;
}

export const useCarrierConfiguration = (
  carrierIdentifier: CarrierIdentifier,
  platform?: SupportedPlatformName,
): UseCarrierConfiguration => {
  const config = getCarrierConfiguration(carrierIdentifier, platform);
  const carrier = useCarrier(carrierIdentifier);

  return {
    carrier,
    config,

    hasPackageType(packageType: PackageTypeName) {
      return config.packageTypes?.includes(packageType) ?? false;
    },

    hasDeliveryType(deliveryType: DeliveryTypeName) {
      return config.deliveryTypes?.includes(deliveryType) ?? false;
    },

    hasShipmentOption(shipmentOption: ShipmentOptionName) {
      return config.shipmentOptions?.includes(shipmentOption) ?? false;
    },

    hasFeature(feature: string) {
      return config.features?.includes(feature) ?? false;
    },
  };
};
