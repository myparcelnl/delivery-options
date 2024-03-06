import {computed} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  getConfigKey,
  resolveCarrierName,
  type SupportedDeliveryTypeName,
  type SupportedPlatformName,
  type SupportedShipmentOptionName,
  useCarrierRequest,
  waitForRequestData,
  useCarrier,
  type ConfigSetting,
  CarrierSetting,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {type ResolvedCarrier} from '../types';
import {useAddressStore} from '../stores';
import {getResolvedValue} from './getResolvedValue';

const DELIVERY_TYPES = [DeliveryTypeName.Standard, DeliveryTypeName.Evening, DeliveryTypeName.Morning];

const resolveOption = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName,
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
  const address = useAddressStore();

  const deliveryTypes = computed(() => {
    return filterSet(config.deliveryTypes.value, (option) => resolveOption(option, carrierIdentifier));
  });

  const shipmentOptions = computed(() => {
    return filterSet(config.shipmentOptions.value, (option) => resolveOption(option, carrierIdentifier));
  });

  const features = computed(() => {
    return filterSet(config.features.value, (option) => {
      return Boolean(getResolvedValue(option as ConfigSetting, carrierIdentifier));
    });
  });

  const hasFakeDelivery = computed(() => {
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      config.fakeDelivery.value &&
      !config.deliveryCountries.value.has(address.cc) &&
      !config.fakeDeliveryBlacklist.value.has(address.cc)
    );
  });

  const hasDelivery = computed(() => {
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      config.deliveryCountries.value.has(address.cc) &&
      DELIVERY_TYPES.some((deliveryType) => {
        const configKey = getConfigKey(deliveryType);
        const value = getResolvedValue(configKey, carrierIdentifier);

        return deliveryTypes.value.has(deliveryType) && value;
      })
    );
  });

  const hasPickup = computed(() => {
    const address = useAddressStore();

    return deliveryTypes.value.has(DeliveryTypeName.Pickup) && config.pickupCountries.value.has(address.cc);
  });

  return {
    ...config.carrier.value,

    config: config.config,

    pickupCountries: config.pickupCountries,
    deliveryCountries: config.deliveryCountries,
    deliveryTypes,
    packageTypes: config.packageTypes,
    shipmentOptions,

    features,

    hasAnyDelivery: computed(() => hasDelivery.value || hasFakeDelivery.value),
    hasDelivery,
    hasFakeDelivery,
    hasPickup,

    get(key, defaultValue) {
      return getResolvedValue(key, carrierIdentifier, defaultValue);
    },
  };
};

export const getResolvedCarrier = useMemoize(cb);
