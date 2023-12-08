import {computed} from 'vue';
import {get} from '@vueuse/core';
import {
  type CarrierIdentifier,
  getCarrierConfiguration,
  getConfigKey,
  resolveCarrierName,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedPlatformName,
  type SupportedShipmentOptionName,
  useCarrierRequest,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {type ResolvedCarrier} from '../types';
import {useAddressStore} from '../stores';
import {getResolvedValue} from './getResolvedValue';

const resolveOption = (
  packageType: SupportedPackageTypeName | SupportedDeliveryTypeName | SupportedShipmentOptionName,
  carrierIdentifier?: CarrierIdentifier,
) => {
  const key = getConfigKey(packageType);

  return Boolean(key && getResolvedValue(key, carrierIdentifier));
};

// eslint-disable-next-line max-lines-per-function
export const getResolvedCarrier = async (
  carrierIdentifier: CarrierIdentifier,
  platformName: SupportedPlatformName,
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
    return new Set(config.packageTypes?.filter((option) => resolveOption(option, carrierIdentifier)) ?? []);
  });

  const allowedDeliveryTypes = computed(() => {
    return new Set(config.deliveryTypes?.filter((option) => resolveOption(option, carrierIdentifier)) ?? []);
  });

  const allowedShipmentOptions = computed(() => {
    return new Set(config.shipmentOptions?.filter((option) => resolveOption(option, carrierIdentifier)) ?? []);
  });

  const features = computed(() => {
    return new Set(config.features?.filter((option) => getResolvedValue(option, carrierIdentifier)) ?? []);
  });

  const hasDelivery = computed(() => {
    const address = useAddressStore();

    return (
      allowedDeliveryTypes.value.has(DeliveryTypeName.Standard) && allowedCountriesDelivery.value.includes(address.cc)
    );
  });

  const hasPickup = computed(() => {
    const address = useAddressStore();

    return allowedDeliveryTypes.value.has(DeliveryTypeName.Pickup) && allowedCountriesPickup.value.includes(address.cc);
  });

  return {
    identifier: carrierIdentifier,
    ...apiCarrier,

    allowedCountriesDelivery,
    allowedCountriesPickup,
    allowedDeliveryTypes,
    allowedPackageTypes,
    allowedShipmentOptions,
    features,

    hasDelivery,
    hasPickup,

    get(key, defaultValue) {
      return getResolvedValue(key, carrierIdentifier, defaultValue);
    },
  };
};
