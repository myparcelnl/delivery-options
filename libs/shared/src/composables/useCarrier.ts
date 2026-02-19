import {type MaybeRef, computed, toValue, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ShipmentOptionName} from '@myparcel-dev/constants';
import {
  resolveCarrierName,
  waitForRequestData,
  getConfigKey,
  getPackageTypePriceKey,
  type ComputedAsync,
  computedAsync,
  mapCapabilityDeliveryType,
  mapCapabilityPackageType,
  mapCapabilityOption,
  mapCapabilityOptionToCustomDeliveryType,
} from '../utils';
import {
  type CarrierIdentifier,
  type SupportedPackageTypeName,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  type CarrierWithIdentifier,
  type ConfigKey,
  type CarrierCapability,
} from '../types';
import {useCapabilities} from './useCapabilities';
import {useCarrierFromCache} from './sdk';

interface UseCarrierOptions {
  carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>;
  apiBaseUrl: string;
  countryCode: string;
  packageType?: string;
}

export interface UseCarrier {
  carrier: ComputedAsync<CarrierWithIdentifier>;
  capability: ComputedRef<CarrierCapability | undefined>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  features: ComputedRef<Set<string>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
}

// eslint-disable-next-line max-lines-per-function
export const useCarrier = useMemoize((options: UseCarrierOptions): UseCarrier => {
  const carrierName = computed(() => {
    const identifier = toValue(options.carrierIdentifier);

    if (!identifier) {
      return undefined;
    }

    return resolveCarrierName(identifier);
  });

  const apiCarrier = computedAsync(
    async () => {
      if (!carrierName.value) return undefined;

      const apiCarrier = await waitForRequestData(useCarrierFromCache, [carrierName.value]);

      if (!apiCarrier) {
        throw new Error();
      }

      return {...apiCarrier, name: carrierName.value, identifier: toValue(options.carrierIdentifier)};
    },
    {
      name: carrierName.value,
      identifier: toValue(options.carrierIdentifier),
    } as CarrierWithIdentifier,
    {immediate: true},
  );

  const capabilities = useCapabilities(options.apiBaseUrl, options.countryCode, options.packageType);

  const capability = computed(() => {
    if (!carrierName.value) {
      return undefined;
    }

    return capabilities.getCarrierCapability(carrierName.value);
  });

  const deliveryTypes = computed(() => {
    const cap = capability.value;

    if (!cap) {
      return new Set<SupportedDeliveryTypeName>();
    }

    const mapped = cap.deliveryTypes
      .map(mapCapabilityDeliveryType)
      .filter((dt): dt is SupportedDeliveryTypeName => dt !== undefined);

    // Also add custom delivery types from options (sameDayDelivery, mondayDelivery, saturdayDelivery)
    for (const optionName of Object.keys(cap.options)) {
      const customType = mapCapabilityOptionToCustomDeliveryType(optionName);

      if (customType) {
        mapped.push(customType);
      }
    }

    return new Set(mapped);
  });

  const packageTypes = computed(() => {
    const cap = capability.value;

    if (!cap) {
      return new Set<SupportedPackageTypeName>();
    }

    const mapped = cap.packageTypes
      .map(mapCapabilityPackageType)
      .filter((pt): pt is SupportedPackageTypeName => pt !== undefined);

    return new Set(mapped);
  });

  const shipmentOptions = computed(() => {
    const cap = capability.value;

    if (!cap) {
      return new Set<SupportedShipmentOptionName>();
    }

    const mapped = Object.keys(cap.options)
      .map(mapCapabilityOption)
      .filter((opt): opt is SupportedShipmentOptionName => opt !== undefined);

    return new Set(mapped);
  });

  const features = computed(() => {
    const getConfigKeyWithoutError = (option: string): ConfigKey | null => {
      try {
        return getConfigKey(option as SupportedDeliveryTypeName | ShipmentOptionName);
      } catch {
        return null;
      }
    };

    return new Set([
      ...[...packageTypes.value].map(getPackageTypePriceKey),
      ...[...deliveryTypes.value, ...shipmentOptions.value].map(getConfigKeyWithoutError).filter((key) => key !== null),
    ]);
  });

  return {
    // @ts-expect-error todo
    carrier: apiCarrier,
    capability,
    deliveryTypes,
    packageTypes,
    shipmentOptions,
    features,
  };
});
