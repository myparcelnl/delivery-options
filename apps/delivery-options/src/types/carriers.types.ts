import {type ComputedRef} from '@vue/reactivity';
import {
  type CarrierIdentifier,
  type SupportedDeliveryTypeName,
  type SupportedPackageTypeName,
  type SupportedShipmentOptionName,
} from '@myparcel-do/shared';
import {type Carrier} from '@myparcel/sdk';

export type ResolvedCarrier = Carrier & {
  identifier: CarrierIdentifier;
  allowedCountriesDelivery: ComputedRef<string[]>;
  allowedCountriesPickup: ComputedRef<string[]>;
  allowedDeliveryTypes: ComputedRef<SupportedDeliveryTypeName[]>;
  allowedPackageTypes: ComputedRef<SupportedPackageTypeName[]>;
  allowedShipmentOptions: ComputedRef<SupportedShipmentOptionName[]>;
  hasDelivery: ComputedRef<boolean>;
  hasPickup: ComputedRef<boolean>;
};
