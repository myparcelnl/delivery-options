import {get, useMemoize} from '@vueuse/core';
import {type DeliveryTypeName, type PackageTypeName, type ShipmentOptionName} from '@myparcel/constants';
import {type CarrierIdentifier, type CarrierOptions, type SupportedPlatformName} from '../types';
import {useCarrierRequest} from '../sdk';
import {useCurrentCountry, useCurrentPlatform} from '../composables';
import {resolveCarrierName} from './resolveCarrierName';
import {getPlatformConfig} from './getPlatformConfig';
import {type FullCarrier} from './getFullCarriers';

const getCarrierConfiguration = (
  carrierIdentifier: CarrierIdentifier,
  platform?: SupportedPlatformName,
): CarrierOptions => {
  const platformConfig = getPlatformConfig(platform ?? useCurrentPlatform().name.value);
  const carrierName = resolveCarrierName(carrierIdentifier);

  const foundCarrier = platformConfig?.carriers.find((carrier) => carrier.name === carrierName);

  if (!foundCarrier) {
    throw new Error(`No configuration found for carrier ${carrierIdentifier}`);
  }

  return foundCarrier;
};

export const getFullCarrier = useMemoize(
  async (carrierIdentifier: CarrierIdentifier, platformName?: SupportedPlatformName): Promise<FullCarrier> => {
    const carrierRequest = useCarrierRequest(resolveCarrierName(carrierIdentifier));
    await carrierRequest.load();

    const config = getCarrierConfiguration(carrierIdentifier, platformName);
    const apiCarrier = get(carrierRequest.data);

    if (!apiCarrier) {
      throw new Error();
    }

    return {
      identifier: carrierIdentifier,
      ...apiCarrier,
      ...config,

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
  },
);
