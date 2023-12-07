import {type CarrierIdentifier, type CarrierOptions, type SupportedPlatformName} from '../types';
import {resolveCarrierName} from './resolveCarrierName';
import {getPlatformConfig} from './getPlatformConfig';

export const getCarrierConfiguration = (
  carrierIdentifier: CarrierIdentifier,
  platform: SupportedPlatformName,
): CarrierOptions => {
  const platformConfig = getPlatformConfig(platform);
  const carrierName = resolveCarrierName(carrierIdentifier);

  const foundCarrier = platformConfig?.carriers.find((carrier) => carrier.name === carrierName);

  if (!foundCarrier) {
    throw new Error(`No configuration found for carrier ${carrierIdentifier}`);
  }

  return foundCarrier;
};
