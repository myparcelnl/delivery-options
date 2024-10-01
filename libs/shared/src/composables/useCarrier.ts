import {type MaybeRef, computed, toValue, type ComputedRef} from 'vue';
import {useMemoize} from '@vueuse/core';
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
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
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
  const shipmentOptions = computed(() => new Set(config.value?.shipmentOptions ?? []));

  const features = computed(() => {
    return new Set([
      ...(config.value?.features ?? []),
      ...[...packageTypes.value].map(getPackageTypePriceKey),
      ...[...deliveryTypes.value, ...shipmentOptions.value].map(getConfigKey),
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
    shipmentOptions,
    smallPackagePickupCountries,

    features,
  };
});
