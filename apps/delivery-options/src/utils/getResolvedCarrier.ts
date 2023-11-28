import {computed} from 'vue';
import {get} from '@vueuse/core';
import {
  type CarrierIdentifier,
  getCarrierConfiguration,
  resolveCarrierName,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedPlatformName,
  type SupportedShipmentOptionName,
  useCarrierRequest,
  useCurrentCountry,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {type ResolvedCarrier} from '../types';
import {getResolvedValue} from './getResolvedValue';
import {getConfigKey} from './getConfigKey';

const resolveOption = (
  packageType: SupportedPackageTypeName | SupportedDeliveryTypeName | SupportedShipmentOptionName,
  carrierIdentifier?: CarrierIdentifier,
) => {
  const key = getConfigKey(packageType);

  return Boolean(key && getResolvedValue(key, carrierIdentifier));
};

export const getResolvedCarrier = async (
  carrierIdentifier: CarrierIdentifier,
  platformName?: SupportedPlatformName,
): Promise<ResolvedCarrier> => {
  const carrierRequest = useCarrierRequest(resolveCarrierName(carrierIdentifier));
  await carrierRequest.load();

  const config = getCarrierConfiguration(carrierIdentifier, platformName);
  const apiCarrier = get(carrierRequest.data);

  if (!apiCarrier) {
    throw new Error();
  }

  const allowedCountriesPickup = computed(() => config.pickupCountries ?? []);
  const allowedCountriesDelivery = computed(() => config.deliveryCountries ?? []);

  const allowedPackageTypes = computed(() => {
    return config.packageTypes?.filter((option) => resolveOption(option, carrierIdentifier)) ?? [];
  });

  const allowedDeliveryTypes = computed(() => {
    return config.deliveryTypes?.filter((option) => resolveOption(option, carrierIdentifier)) ?? [];
  });

  const allowedShipmentOptions = computed(() => {
    return config.shipmentOptions?.filter((option) => resolveOption(option, carrierIdentifier)) ?? [];
  });

  const hasDelivery = computed(() => {
    const currentCountry = useCurrentCountry();

    return (
      allowedDeliveryTypes.value.includes(DeliveryTypeName.Standard) &&
      allowedCountriesDelivery.value.includes(currentCountry.value)
    );
  });

  const hasPickup = computed(() => {
    const currentCountry = useCurrentCountry();

    return (
      allowedDeliveryTypes.value.includes(DeliveryTypeName.Pickup) &&
      allowedCountriesPickup.value.includes(currentCountry.value)
    );
  });

  return {
    identifier: carrierIdentifier,
    ...apiCarrier,

    allowedCountriesDelivery,
    allowedCountriesPickup,
    allowedDeliveryTypes,
    allowedPackageTypes,
    allowedShipmentOptions,
    hasDelivery,
    hasPickup,
  };
};
