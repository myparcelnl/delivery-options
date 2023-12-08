import {type ComputedRef} from '@vue/reactivity';
import {
  type CarrierIdentifier,
  type CarrierSettings,
  type CarrierSettingsKey,
  type ConfigKey,
  type DeliveryOptionsConfig,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {type Carrier} from '@myparcel/sdk';

export type ResolvedCarrier = Carrier & {
  identifier: CarrierIdentifier;
  allowedCountriesDelivery: ComputedRef<string[]>;
  allowedCountriesPickup: ComputedRef<string[]>;
  allowedDeliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  allowedPackageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  allowedShipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
  features: ComputedRef<Set<ConfigKey>>;
  hasDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  get<Key extends ConfigKey | CarrierSettingsKey>(
    key: Key,
    defaultValue?: NonNullable<Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key]>,
  ): Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key];
};
