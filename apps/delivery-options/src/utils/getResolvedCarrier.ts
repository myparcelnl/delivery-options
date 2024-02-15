import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  getConfigKey,
  resolveCarrierName,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedPlatformName,
  type SupportedShipmentOptionName,
  useCarrierRequest,
  waitForRequestData,
  useCarrier,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {type ResolvedCarrier} from '../types';
import {useAddressStore} from '../stores';
import {getResolvedValue} from './getResolvedValue';

const DELIVERY_TYPES = [DeliveryTypeName.Standard, DeliveryTypeName.Evening, DeliveryTypeName.Morning];

const resolveOption = (
  input: SupportedPackageTypeName | SupportedDeliveryTypeName | SupportedShipmentOptionName,
  carrierIdentifier?: CarrierIdentifier,
) => {
  const key = getConfigKey(input);
  return Boolean(key && getResolvedValue(key, carrierIdentifier));
};

const filterSet = <T>(set: Set<T>, cb: (value: T) => boolean) => {
  return new Set([...set]?.filter(cb) ?? []);
};

// eslint-disable-next-line max-lines-per-function
const cb = async (
  carrierIdentifier: CarrierIdentifier,
  platformName: SupportedPlatformName,
): Promise<ResolvedCarrier> => {
  await waitForRequestData(useCarrierRequest, [resolveCarrierName(carrierIdentifier)]);

  const config = useCarrier({carrierIdentifier, platformName});

  const deliveryTypes = computed(() => {
    return filterSet(config.deliveryTypes.value, (option) => resolveOption(option, carrierIdentifier));
  });

  const shipmentOptions = computed(() => {
    return filterSet(config.shipmentOptions.value, (option) => resolveOption(option, carrierIdentifier));
  });

  const features = computed(() => {
    return filterSet(config.features.value, (option) => getResolvedValue(option, carrierIdentifier));
  });

  const hasDelivery = computed(() => {
    const address = useAddressStore();

    return (
      DELIVERY_TYPES.some((deliveryType) => {
        const configKey = getConfigKey(deliveryType);
        const val = getResolvedValue(configKey, carrierIdentifier);

        return deliveryTypes.value.has(deliveryType) && val;
      }) && config.deliveryCountries.value.has(address.cc)
    );
  });

  const hasPickup = computed(() => {
    const address = useAddressStore();

    return deliveryTypes.value.has(DeliveryTypeName.Pickup) && config.pickupCountries.value.has(address.cc);
  });

  return {
    ...config.carrier.value,

    pickupCountries: config.pickupCountries,
    deliveryCountries: config.deliveryCountries,
    deliveryTypes,
    packageTypes: config.packageTypes,
    shipmentOptions,

    features,

    hasDelivery,
    hasPickup,

    get(key, defaultValue) {
      return getResolvedValue(key, carrierIdentifier, defaultValue);
    },
  };
};

export const getResolvedCarrier = useMemoize(cb);
