import {type CarrierIdentifier, type CarrierConfiguration, type SupportedPlatformName} from '../types';
import {resolveCarrierName} from './resolveCarrierName';
import {getPlatformConfig} from './getPlatformConfig';

export const getCarrierConfiguration = (
  carrierIdentifier: CarrierIdentifier,
  platform: SupportedPlatformName,
): CarrierConfiguration => {
  const platformConfig = getPlatformConfig(platform);
  const carrierName = resolveCarrierName(carrierIdentifier);

  const carrierConfig = platformConfig.carriers.find((carrier) => carrier.name === carrierName);

  if (!carrierConfig) {
    throw new Error(`No configuration found for carrier ${carrierIdentifier}`);
  }

  return carrierConfig;
};
