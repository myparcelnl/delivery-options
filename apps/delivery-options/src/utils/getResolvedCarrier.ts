import {computed, ref} from 'vue';
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

  const carrier = useCarrier({carrierIdentifier, platformName});
  const address = useAddressStore();

  const disabledDeliveryTypes = ref(new Set<SupportedDeliveryTypeName>());

  const deliveryTypes = computed(() => {
    return filterSet(carrier.deliveryTypes.value, (option) => {
      return !disabledDeliveryTypes.value.has(option) && resolveOption(option, carrierIdentifier);
    });
  });

  const shipmentOptions = computed(() => {
    return filterSet(carrier.shipmentOptions.value, (option) => resolveOption(option, carrierIdentifier));
  });

  const features = computed(() => {
    return filterSet(carrier.features.value, (option) => {
      return Boolean(getResolvedValue(option as ConfigSetting, carrierIdentifier));
    });
  });

  const hasFakeDelivery = computed(() => {
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      carrier.fakeDelivery.value &&
      !carrier.deliveryCountries.value.has(address.cc) &&
      !carrier.fakeDeliveryBlacklist.value.has(address.cc)
    );
  });

  const hasDelivery = computed(() => {
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      carrier.deliveryCountries.value.has(address.cc) &&
      DELIVERY_TYPES.some((deliveryType) => {
        const configKey = getConfigKey(deliveryType);
        const value = getResolvedValue(configKey, carrierIdentifier);

        return deliveryTypes.value.has(deliveryType) && value;
      })
    );
  });

  const hasPickup = computed(() => {
    const address = useAddressStore();

    return deliveryTypes.value.has(DeliveryTypeName.Pickup) && carrier.pickupCountries.value.has(address.cc);
  });

  return {
    ...carrier.carrier.value,

    carrier: carrier.carrier,
    config: carrier.config,

    pickupCountries: carrier.pickupCountries,
    deliveryCountries: carrier.deliveryCountries,
    deliveryTypes,
    packageTypes: carrier.packageTypes,
    shipmentOptions,

    features,

    hasAnyDelivery: computed(() => hasDelivery.value || hasFakeDelivery.value),
    hasDelivery,
    hasFakeDelivery,
    hasPickup,

    disabledDeliveryTypes,

    get(key, defaultValue) {
      return getResolvedValue(key, carrierIdentifier, defaultValue);
    },
  };
};

export const getResolvedCarrier = useMemoize(cb);
