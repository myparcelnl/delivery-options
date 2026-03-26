import {type CarrierCapability, type CarrierIdentifier, CarrierSetting} from '@myparcel-dev/do-shared';
import {getResolvedValue} from './getResolvedValue';

export const hasPickupForCarrier = (cap: CarrierCapability, carrierIdentifier?: CarrierIdentifier): boolean => {
  return (
    cap.deliveryTypes.includes('PICKUP_DELIVERY') &&
    Boolean(getResolvedValue(CarrierSetting.AllowPickupLocations, carrierIdentifier))
  );
};
