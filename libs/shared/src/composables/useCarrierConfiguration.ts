import {useMemoize} from '@vueuse/core';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';
import {getPlatformConfig, resolveCarrierName} from '../utils';
import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {useCarrier} from '../sdk';
import {useCurrentPlatform} from './useCurrentPlatform';
import {useCurrentCountry} from './useCurrentCountry';

const getCarrierConfiguration = useMemoize((carrierIdentifier: CarrierIdentifier, platform?: SupportedPlatformName) => {
  const platformConfig = getPlatformConfig(platform ?? useCurrentPlatform().name.value);
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
  hasDeliveryInCountry(countryCode?: string): boolean;
  hasDeliveryType(deliveryType: DeliveryTypeName): boolean;
  hasFeature(feature: string): boolean;
  hasPackageType(packageType: PackageTypeName): boolean;
  hasPickupInCountry(countryCode?: string): boolean;
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
      const allFeatures = config.features?.flat();

      return allFeatures?.includes(feature) ?? false;
    },

    hasDeliveryInCountry(countryCode?: string): boolean {
      const resolvedCountryCode = countryCode ?? useCurrentCountry().value;

      return config.deliveryCountries?.includes(resolvedCountryCode) ?? false;
    },

    hasPickupInCountry(countryCode?: string): boolean {
      const resolvedCountryCode = countryCode ?? useCurrentCountry().value;

      return config.pickupCountries?.includes(resolvedCountryCode) ?? false;
    },
  };
};
