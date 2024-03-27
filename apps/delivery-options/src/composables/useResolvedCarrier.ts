import {toValue, type ComputedRef, type Ref} from 'vue';
import {type MaybeRef} from '@vueuse/core';
import {
  type CarrierIdentifier,
  type ComputedAsync,
  type CarrierWithIdentifier,
  type CarrierConfiguration,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
  type ConfigKey,
  type CarrierSettingsKey,
  type DeliveryOptionsConfig,
  type CarrierSettings,
} from '@myparcel-do/shared';
import {getResolvedCarrier} from '../utils';
import {useConfigStore} from '../stores';

export type UseResolvedCarrier = {
  carrier: ComputedAsync<CarrierWithIdentifier>;
  config: ComputedRef<CarrierConfiguration | undefined>;
  pickupCountries: ComputedRef<Set<string>>;
  deliveryCountries: ComputedRef<Set<string>>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  disabledDeliveryTypes: Ref<Set<SupportedDeliveryTypeName>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
  features: ComputedRef<Set<string>>;
  hasDelivery: ComputedRef<boolean>;
  hasFakeDelivery: ComputedRef<boolean>;
  hasAnyDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  get<Key extends ConfigKey | CarrierSettingsKey>(
    key: Key,
    defaultValue?: NonNullable<Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key]>,
  ): Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key];

  options: ComputedRef<Record<string, any>>;
};

export const useResolvedCarrier = (carrierIdentifier: MaybeRef<CarrierIdentifier | undefined>): UseResolvedCarrier => {
  const config = useConfigStore();
  const identifier = toValue(carrierIdentifier);

  return getResolvedCarrier(identifier, config.platform);
};
