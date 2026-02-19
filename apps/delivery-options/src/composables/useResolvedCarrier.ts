import {toValue, type ComputedRef, type Ref} from 'vue';
import {type MaybeRef} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type ComputedAsync,
  type CarrierWithIdentifier,
  type CarrierCapability,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
  type ConfigKey,
  type CarrierSettingsKey,
  mapPackageTypeToCapability,
} from '@myparcel-dev/do-shared';
import {getResolvedCarrier} from '../utils';
import {useAddressStore, useConfigStore} from '../stores';

export type UseResolvedCarrier = {
  carrier: ComputedAsync<CarrierWithIdentifier>;
  capability: ComputedRef<CarrierCapability | undefined>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  disabledDeliveryTypes: Ref<Set<SupportedDeliveryTypeName>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
  features: ComputedRef<Set<string>>;
  hasDelivery: ComputedRef<boolean>;
  hasAnyDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: ConfigKey | CarrierSettingsKey, defaultValue?: any): any;
};

export const useResolvedCarrier = (carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>): UseResolvedCarrier => {
  const {state: config} = useConfigStore();
  const {state: address} = useAddressStore();
  const identifier = toValue(carrierIdentifier);

  return getResolvedCarrier(identifier, address.cc, config.apiBaseUrl, mapPackageTypeToCapability(config.packageType));
};
