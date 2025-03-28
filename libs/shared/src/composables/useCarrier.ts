import {type MaybeRef, computed, toValue, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
import {type ShipmentOptionName} from '@myparcel/constants';
import {
  resolveCarrierName,
  waitForRequestData,
  getCarrierConfiguration,
  getConfigKey,
  getPackageTypePriceKey,
  type ComputedAsync,
  computedAsync,
} from '../utils';
import {
  type CarrierIdentifier,
  type SupportedPlatformName,
  type SupportedPackageTypeName,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
  type CarrierConfiguration,
  type CarrierWithIdentifier,
} from '../types';
import {useCarrierRequest} from './sdk';

interface UseCarrierOptions {
  carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>;
  platformName: MaybeRef<SupportedPlatformName>;
}

export interface UseCarrier {
  carrier: ComputedAsync<CarrierWithIdentifier>;
  config: ComputedRef<CarrierConfiguration | undefined>;
  deliveryCountries: ComputedRef<Set<string>>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  fakeDelivery: ComputedRef<boolean>;
  fakeDeliveryBlacklist: ComputedRef<Set<string>>;
  features: ComputedRef<Set<string>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  pickupCountries: ComputedRef<Set<string>>;
  shipmentOptionsPerPackageType: ComputedRef<
    Partial<Record<SupportedPackageTypeName, Set<SupportedShipmentOptionName>>>
  >;
  smallPackagePickupCountries: ComputedRef<Set<string>>;
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

      const apiCarrier = await waitForRequestData(useCarrierRequest, [carrierName.value]);

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

  const config = computed(() => {
    if (!carrierName.value) return undefined;

    return getCarrierConfiguration(carrierName.value, toValue(options.platformName));
  });

  const fakeDelivery = computed(() => Boolean(config.value?.fakeDelivery));
  const fakeDeliveryBlacklist = computed(() => new Set(config.value?.fakeDeliveryBlacklist ?? []));

  const pickupCountries = computed(() => new Set(config.value?.pickupCountries ?? []));
  const deliveryCountries = computed(() => new Set(config.value?.deliveryCountries ?? []));
  const packageTypes = computed(() => new Set(config.value?.packageTypes ?? []));
  const deliveryTypes = computed(() => new Set(config.value?.deliveryTypes ?? []));
  const shipmentOptionsPerPackageType = computed(() => {
    // For each package type, convert the array of shipment options to a set
    return Object.entries(config.value?.shipmentOptionsPerPackageType ?? {}).reduce((acc, [key, options]) => {
      acc[key as SupportedPackageTypeName] = new Set(options);
      return acc;
    }, {} as Partial<Record<SupportedPackageTypeName, Set<SupportedShipmentOptionName>>>);
  });

  const features = computed(() => {
    // Combine all the shipment option names from `shipmentOptionsPerPackageType` into a single array
    const shipmentOptionSets = Object.values(shipmentOptionsPerPackageType.value);
    const allShipmentOptions: ShipmentOptionName[] = [];
    for (const shipmentOptionSet of shipmentOptionSets) {
      // Inject only those items that are not already in the array
      const newOptions = [...shipmentOptionSet].filter((item) => !allShipmentOptions.includes(item));

      if (newOptions.length) {
        allShipmentOptions.push(...newOptions);
      }
    }

    return new Set([
      ...(config.value?.features ?? []),
      ...[...packageTypes.value].map(getPackageTypePriceKey),
      ...[...deliveryTypes.value, ...allShipmentOptions].map(getConfigKey),
    ]);
  });

  const smallPackagePickupCountries = computed(() => new Set(config.value?.smallPackagePickupCountries ?? []));

  return {
    // @ts-expect-error todo
    carrier: apiCarrier,

    config,

    fakeDelivery,
    fakeDeliveryBlacklist,

    pickupCountries,
    deliveryCountries,
    packageTypes,
    deliveryTypes,
    shipmentOptionsPerPackageType,
    smallPackagePickupCountries,

    features,
  };
});
