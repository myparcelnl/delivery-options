import {type MaybeRef, computed, toValue, type ComputedRef, type Ref} from 'vue';
import {asyncComputed} from '@vueuse/core';
import {type Carrier} from '@myparcel/sdk';
import {
  resolveCarrierName,
  waitForRequestData,
  getCarrierConfiguration,
  getConfigKey,
  getPackageTypePriceKey,
} from '../utils';
import {
  type CarrierIdentifier,
  type SupportedPlatformName,
  type SupportedPackageTypeName,
  type SupportedDeliveryTypeName,
  type SupportedShipmentOptionName,
} from '../types';
import {useCarrierRequest} from './sdk';

interface UseCarrierOptions {
  carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>;
  platformName: MaybeRef<SupportedPlatformName>;
}

export interface UseCarrier {
  carrier: Ref<Carrier & {identifier: CarrierIdentifier}>;
  deliveryCountries: ComputedRef<Set<string>>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  features: ComputedRef<Set<string>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  pickupCountries: ComputedRef<Set<string>>;
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
}

export const useCarrier = (options: UseCarrierOptions): UseCarrier => {
  const carrierName = computed(() => {
    const identifier = toValue(options.carrierIdentifier);

    if (!identifier) {
      return undefined;
    }

    return resolveCarrierName(identifier);
  });

  const apiCarrier = asyncComputed(async () => {
    if (!carrierName.value) return undefined;

    const apiCarrier = await waitForRequestData(useCarrierRequest, [carrierName.value]);

    if (!apiCarrier) {
      throw new Error();
    }

    return apiCarrier;
  });

  const config = computed(() => {
    if (!carrierName.value) return undefined;

    return getCarrierConfiguration(carrierName.value, toValue(options.platformName));
  });

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

  const carrier = computed(() => ({
    ...apiCarrier.value,
    name: carrierName.value,
    identifier: toValue(options.carrierIdentifier),
  }));

  return {
    carrier: carrier as Ref<Carrier & {identifier: CarrierIdentifier}>,

    pickupCountries,
    deliveryCountries,
    packageTypes,
    deliveryTypes,
    shipmentOptions,

    features,
  };
};
