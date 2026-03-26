import {computed, ref} from 'vue';
import {useMemoize} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type CarrierWithIdentifier,
  getConfigKey,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  type SupportedPackageTypeName,
  type ConfigSetting,
  type ConfigKey,
  normalizeCarrierName,
  resolveCarrierName,
  computedAsync,
  waitForRequestData,
  useCarrierFromCache,
  mapCapabilityPackageType,
  mapCapabilityOption,
  getPackageTypePriceKey,
} from '@myparcel-dev/do-shared';
import {type ShipmentOptionName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier, useBroadCapabilities} from '../composables';
import {hasPickupForCarrier} from './hasPickupForCarrier';
import {hasDeliveryForCarrier} from './hasDeliveryForCarrier';
import {getResolvedValue} from './getResolvedValue';
import {getCapabilityDeliveryTypes} from './getCapabilityDeliveryTypes';

const resolveOption = (
  input: SupportedDeliveryTypeName | SupportedShipmentOptionName,
  carrierIdentifier?: CarrierIdentifier,
) => {
  let key: ConfigKey | null = null;
  try {
    key = getConfigKey(input);
  } catch (error) {
    console.warn(error, 'disabling option'); // eslint-disable-line no-console
  }

  return Boolean(key && getResolvedValue(key, carrierIdentifier));
};

const filterSet = <T>(set: Set<T>, cb: (value: T) => boolean) => {
  return new Set([...set]?.filter(cb) ?? []);
};

const getConfigKeyOrNull = (option: string): ConfigKey | null => {
  try {
    return getConfigKey(option as SupportedDeliveryTypeName | ShipmentOptionName);
  } catch {
    return null;
  }
};

export const getResolvedCarrier = useMemoize(
  // eslint-disable-next-line max-lines-per-function
  (carrierIdentifier: CarrierIdentifier | undefined): UseResolvedCarrier => {
    const carrierName = resolveCarrierName(carrierIdentifier ?? '');

    const apiCarrier = computedAsync(
      async () => {
        const data = await waitForRequestData(useCarrierFromCache, [carrierName]);

        if (!data) throw new Error();

        return {...data, name: carrierName, identifier: carrierIdentifier} as CarrierWithIdentifier;
      },
      {name: carrierName, identifier: carrierIdentifier} as CarrierWithIdentifier,
      {immediate: true},
    );

    // Use the singleton reactive capabilities instance.
    const capabilities = useBroadCapabilities();
    const normalizedName = normalizeCarrierName(carrierName);

    const capability = computed(() => capabilities.getCarrierCapability(normalizedName));

    const disabledDeliveryTypes = ref(new Set<SupportedDeliveryTypeName>());

    // Derive delivery types directly from capabilities for reliable reactivity.
    const allDeliveryTypes = computed(() => {
      const cap = capability.value;

      if (!cap) {
        return new Set<SupportedDeliveryTypeName>();
      }

      return new Set(getCapabilityDeliveryTypes(cap));
    });

    const deliveryTypes = computed(() => {
      return filterSet(allDeliveryTypes.value, (option) => {
        return !disabledDeliveryTypes.value.has(option) && resolveOption(option, carrierIdentifier);
      });
    });

    const packageTypes = computed(() => {
      const cap = capability.value;

      if (!cap) {
        return new Set<SupportedPackageTypeName>();
      }

      return new Set(
        cap.packageTypes.map(mapCapabilityPackageType).filter((pt): pt is SupportedPackageTypeName => pt !== undefined),
      );
    });

    const shipmentOptions = computed(() => {
      const cap = capability.value;

      if (!cap) {
        return new Set<SupportedShipmentOptionName>();
      }

      return filterSet(
        new Set(
          Object.keys(cap.options)
            .map(mapCapabilityOption)
            .filter((opt): opt is SupportedShipmentOptionName => opt !== undefined),
        ),
        (option) => resolveOption(option, carrierIdentifier),
      );
    });

    const features = computed(() => {
      return new Set(
        [
          ...[...packageTypes.value].map(getPackageTypePriceKey),
          ...[...deliveryTypes.value, ...shipmentOptions.value].map(getConfigKeyOrNull).filter((key) => key !== null),
        ].filter((key) => Boolean(getResolvedValue(key as ConfigSetting, carrierIdentifier))),
      );
    });

    // Read capabilities directly for hasDelivery/hasPickup to ensure a direct reactive
    // dependency on capabilities.value — avoids going through the deep computed chain
    // (capability → allDeliveryTypes → deliveryTypes) which can miss reactive updates.
    const hasDelivery = computed(() => {
      const cap = capabilities.getCarrierCapability(normalizedName);

      return Boolean(cap && hasDeliveryForCarrier(cap, carrierIdentifier));
    });

    const hasPickup = computed(() => {
      const cap = capabilities.getCarrierCapability(normalizedName);

      return Boolean(cap && hasPickupForCarrier(cap, carrierIdentifier));
    });

    return {
      carrier: apiCarrier,
      capability,
      deliveryTypes,
      packageTypes,
      shipmentOptions,
      features,

      hasAnyDelivery: computed(() => hasDelivery.value),
      hasDelivery,
      hasPickup,

      disabledDeliveryTypes,

      get(key, defaultValue) {
        return getResolvedValue(key, carrierIdentifier, defaultValue);
      },
    };
  },
);
