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
  useLogger,
} from '@myparcel-dev/do-shared';
import {type ShipmentOptionName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier, useSharedCapabilities} from '../composables';
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
    useLogger().warning(error, 'disabling option');
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

/**
 * Memoized factory that derives all per-carrier state from the singleton
 * shared capabilities and the config store. One instance is created per
 * carrierIdentifier — call with the same identifier to get the cached result.
 */
export const getResolvedCarrier = useMemoize(
  // eslint-disable-next-line max-lines-per-function
  (carrierIdentifier: CarrierIdentifier): UseResolvedCarrier => {
    const carrierName = resolveCarrierName(carrierIdentifier);

    /** Fetches carrier metadata from the SDK cache. */
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
    const capabilities = useSharedCapabilities();
    const normalizedName = normalizeCarrierName(carrierName);

    /** Looks up this carrier's entry in the shared capabilities response. */
    const capability = computed(() => capabilities.getCarrierCapability(normalizedName));

    const fromCapability = <T>(
      transform: (cap: NonNullable<ReturnType<(typeof capability)['value']>>) => Set<T>,
    ): Set<T> => {
      const cap = capability.value;

      if (!cap) return new Set<T>();

      return transform(cap);
    };

    /** Mutable set of delivery types currently disabled (e.g. due to API errors). */
    const disabledDeliveryTypes = ref(new Set<SupportedDeliveryTypeName>());

    // Derive delivery types directly from capabilities for reliable reactivity.
    const allDeliveryTypes = computed(() => fromCapability((cap) => new Set(getCapabilityDeliveryTypes(cap))));

    /** Delivery types this carrier supports, filtered by config settings. */
    const deliveryTypes = computed(() => {
      return filterSet(allDeliveryTypes.value, (option) => {
        return !disabledDeliveryTypes.value.has(option) && resolveOption(option, carrierIdentifier);
      });
    });

    /** Package types this carrier supports, mapped from capability. */
    const packageTypes = computed(() =>
      fromCapability(
        (cap) =>
          new Set(
            cap.packageTypes
              .map(mapCapabilityPackageType)
              .filter((pt): pt is SupportedPackageTypeName => pt !== undefined),
          ),
      ),
    );

    /** Shipment options this carrier supports, filtered to known SDK options. */
    const shipmentOptions = computed(() =>
      fromCapability((cap) =>
        filterSet(
          new Set(
            Object.keys(cap.options)
              .map(mapCapabilityOption)
              .filter((opt): opt is SupportedShipmentOptionName => opt !== undefined),
          ),
          (option) => resolveOption(option, carrierIdentifier),
        ),
      ),
    );

    /** Union of all delivery types, package types, and shipment options — used for config-setting lookups. */
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
    /** True if the carrier has at least one active delivery type. Reads capabilities directly to ensure reactive updates. */
    const hasDelivery = computed(() => {
      const cap = capabilities.getCarrierCapability(normalizedName);

      return Boolean(cap && hasDeliveryForCarrier(cap, carrierIdentifier));
    });

    /** True if the carrier has pickup locations available. Reads capabilities directly. */
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

      /** Resolves a carrier-specific config value, falling back to the global config then to defaultValue. */
      get(key, defaultValue) {
        return getResolvedValue(key, carrierIdentifier, defaultValue);
      },
    };
  },
);
