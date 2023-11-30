import {type ComputedRef} from '@vue/reactivity';
import {
  type CarrierIdentifier,
  type CarrierSettings,
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
  features: ComputedRef<Set<keyof CarrierSettings>>;
  hasDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
  get<K extends keyof CarrierSettings>(key: K, defaultValue?: NonNullable<CarrierSettings[K]>): CarrierSettings[K];
};
