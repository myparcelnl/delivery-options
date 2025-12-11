import type {CarrierIdentifier} from '@myparcel-do/shared';

export interface PersistedSelectedValues {
  homeOrPickup: string;
  deliveryDate?: string;
  deliveryMoment?: string;
  shipmentOptions?: string[];
  pickupLocation?: string;
  carrier?: CarrierIdentifier;
}
