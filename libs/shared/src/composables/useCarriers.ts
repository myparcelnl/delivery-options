import {type CarrierIdentifier, type SupportedPlatformName} from '../types';
import {useCarrier, type UseCarrier} from './useCarrier';

export const useCarriers = (
  carrierIdentifiers: CarrierIdentifier[],
  platformName: SupportedPlatformName,
): UseCarrier[] => {
  return carrierIdentifiers.map((carrierIdentifier) => useCarrier({carrierIdentifier, platformName}));
};
