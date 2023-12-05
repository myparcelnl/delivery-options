import {type ComputedRef} from '@vue/reactivity';
import {
  type AnyConfigKey,
  type CarrierIdentifier,
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
  features: ComputedRef<Set<AnyConfigKey>>;
  hasDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  get<K extends AnyConfigKey>(key: K, defaultValue?: NonNullable<DeliveryOptionsConfig[K]>): DeliveryOptionsConfig[K];
};
