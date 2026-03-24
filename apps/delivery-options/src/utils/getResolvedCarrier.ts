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
  CarrierSetting,
  type ConfigKey,
  normalizeCarrierName,
  resolveCarrierName,
  computedAsync,
  waitForRequestData,
  useCarrierFromCache,
  mapCapabilityDeliveryType,
  mapCapabilityPackageType,
  mapCapabilityOption,
  mapCapabilityOptionToCustomDeliveryType,
  getPackageTypePriceKey,
} from '@myparcel-dev/do-shared';
import {type ShipmentOptionName, DeliveryTypeName} from '@myparcel-dev/constants';
import {type UseResolvedCarrier, useBroadCapabilities} from '../composables';
import {getResolvedValue} from './getResolvedValue';

const DELIVERY_TYPES = [
  DeliveryTypeName.Standard,
  DeliveryTypeName.Express,
  DeliveryTypeName.Evening,
  DeliveryTypeName.Morning,
];

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

      const mapped = cap.deliveryTypes
        .map(mapCapabilityDeliveryType)
        .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

      for (const optionName of Object.keys(cap.options)) {
        const customType = mapCapabilityOptionToCustomDeliveryType(optionName);

        if (customType) {
          mapped.push(customType);
        }
      }

      return new Set(mapped);
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
      if (!getResolvedValue(CarrierSetting.AllowDeliveryOptions, carrierIdentifier)) {
        return false;
      }

      const cap = capabilities.getCarrierCapability(normalizedName);

      if (!cap) {
        return false;
      }

      return DELIVERY_TYPES.some((deliveryType) => {
        const configKey = getConfigKey(deliveryType);
        const configEnabled = getResolvedValue(configKey, carrierIdentifier);

        if (!configEnabled) {
          return false;
        }

        // Check capabilities directly for this delivery type
        const capDeliveryTypes = cap.deliveryTypes
          .map(mapCapabilityDeliveryType)
          .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

        // Also check options that map to custom delivery types
        for (const optionName of Object.keys(cap.options)) {
          const customType = mapCapabilityOptionToCustomDeliveryType(optionName);

          if (customType) {
            capDeliveryTypes.push(customType);
          }
        }

        return capDeliveryTypes.includes(deliveryType);
      });
    });

    const hasPickup = computed(() => {
      const cap = capabilities.getCarrierCapability(normalizedName);

      if (!cap) {
        return false;
      }

      return (
        cap.deliveryTypes.includes('PICKUP_DELIVERY') &&
        Boolean(getResolvedValue(CarrierSetting.AllowPickupLocations, carrierIdentifier))
      );
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
