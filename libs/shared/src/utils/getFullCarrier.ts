import {get, useMemoize} from '@vueuse/core';
import {type CarrierIdentifier, type FullCarrier, type SupportedPlatformName} from '../types';
import {useCarrierRequest} from '../sdk';
import {resolveCarrierName} from './resolveCarrierName';
import {getCarrierConfiguration} from './getCarrierConfiguration';

export const getFullCarrier = useMemoize(
  async (carrierIdentifier: CarrierIdentifier, platformName: SupportedPlatformName): Promise<FullCarrier> => {
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

      hasPackageType(packageType) {
        return config.packageTypes?.includes(packageType) ?? false;
      },

      hasDeliveryType(deliveryType) {
        return config.deliveryTypes?.includes(deliveryType) ?? false;
      },

      hasShipmentOption(shipmentOption) {
        return config.shipmentOptions?.includes(shipmentOption) ?? false;
      },

      hasFeature(feature) {
        const allFeatures = config.features?.flat();

        return allFeatures?.includes(feature) ?? false;
      },

      hasDeliveryInCountry(countryCode) {
        return config.deliveryCountries?.includes(countryCode) ?? false;
      },

      hasPickupInCountry(countryCode) {
        return config.pickupCountries?.includes(countryCode) ?? false;
      },
    };
  },
);
