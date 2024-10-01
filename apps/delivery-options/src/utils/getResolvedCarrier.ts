import {computed, ref} from 'vue';
import {
  type CarrierIdentifier,
  getConfigKey,
  type SupportedDeliveryTypeName,
  type SupportedPlatformName,
  type SupportedShipmentOptionName,
  useCarrier,
  type ConfigSetting,
  CarrierSetting,
} from '@myparcel-do/shared';
import {DeliveryTypeName} from '@myparcel/constants';
import {useAddressStore} from '../stores';
import {type UseResolvedCarrier} from '../composables';
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
export const getResolvedCarrier = (
  carrierIdentifier: CarrierIdentifier | undefined,
  platformName: SupportedPlatformName,
): UseResolvedCarrier => {
  const carrier = useCarrier({carrierIdentifier, platformName});

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
    const {cc} = useAddressStore(); // Only when defined here is the cc not stale
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      carrier.fakeDelivery.value &&
      !carrier.deliveryCountries.value.has(cc) &&
      !carrier.fakeDeliveryBlacklist.value.has(cc)
    );
  });

  const hasDelivery = computed(() => {
    const {cc} = useAddressStore(); // Only when defined here is the cc not stale
    return (
      getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier) &&
      carrier.deliveryCountries.value.has(cc) &&
      DELIVERY_TYPES.some((deliveryType) => {
        const configKey = getConfigKey(deliveryType);
        const value = getResolvedValue(configKey, carrierIdentifier);

        return deliveryTypes.value.has(deliveryType) && value;
      })
    );
  });

  const hasPickup = computed(() => {
    const {cc} = useAddressStore(); // Only when defined here is the cc not stale
    return deliveryTypes.value.has(DeliveryTypeName.Pickup) && carrier.pickupCountries.value.has(cc);
  });

  const hasSmallPackagePickup = computed(() => {
    const {cc} = useAddressStore(); // Only when defined here is the cc not stale
    return deliveryTypes.value.has(DeliveryTypeName.Pickup) && carrier.smallPackagePickupCountries.value.has(cc);
  });

  return {
    carrier: carrier.carrier,
    config: carrier.config,

    pickupCountries: carrier.pickupCountries,
    smallPackagePickupCountries: carrier.smallPackagePickupCountries,
    deliveryCountries: carrier.deliveryCountries,
    deliveryTypes,
    packageTypes: carrier.packageTypes,
    shipmentOptions,

    features,

    hasAnyDelivery: computed(() => hasDelivery.value || hasFakeDelivery.value),
    hasDelivery,
    hasFakeDelivery,
    hasPickup,
    hasSmallPackagePickup,

    disabledDeliveryTypes,

    get(key, defaultValue) {
      return getResolvedValue(key, carrierIdentifier, defaultValue);
    },
  };
};
