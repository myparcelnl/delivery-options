import {type ComputedRef} from 'vue';
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
  pickupCountries: ComputedRef<Set<string>>;
  deliveryCountries: ComputedRef<Set<string>>;
  deliveryTypes: ComputedRef<Set<SupportedDeliveryTypeName>>;
  packageTypes: ComputedRef<Set<SupportedPackageTypeName>>;
  shipmentOptions: ComputedRef<Set<SupportedShipmentOptionName>>;
  features: ComputedRef<Set<string>>;
  hasDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  get<Key extends ConfigKey | CarrierSettingsKey>(
    key: Key,
    defaultValue?: NonNullable<Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key]>,
  ): Key extends ConfigKey ? DeliveryOptionsConfig[Key] : CarrierSettings[Key];
};
