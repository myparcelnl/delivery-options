import {type CarrierCapability, type CarrierIdentifier, CarrierSetting} from '@myparcel-dev/do-shared';
import {getResolvedValue} from './getResolvedValue';

/**
 * Returns true if the carrier capability includes PICKUP_DELIVERY and the
 * AllowPickupLocations config setting is not explicitly disabled.
 */
export const hasPickupForCarrier = (cap: CarrierCapability, carrierIdentifier?: CarrierIdentifier): boolean => {
  return (
    cap.deliveryTypes.includes('PICKUP_DELIVERY') &&
    Boolean(getResolvedValue(CarrierSetting.AllowPickupLocations, carrierIdentifier))
  );
};
